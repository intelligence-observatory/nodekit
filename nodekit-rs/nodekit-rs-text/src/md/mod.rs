mod font_size;
mod list_state;
mod paragraph;
mod span;

use crate::error::Error;
pub(crate) use crate::md::list_state::ListState;
use crate::md::paragraph::Paragraph;
use cosmic_text::{Attrs, Color, Style, Weight};
pub(crate) use font_size::*;
use hex_color::HexColor;
use markdown::mdast::Html;
use markdown::{Constructs, ParseOptions, mdast::Node, to_mdast};
use scraper::Selector;
pub use span::Span;

macro_rules! paragraph_mut {
    ($paragraph:ident) => {{
        $paragraph
            .as_mut()
            .map(|p| if p.spans.is_empty() { None } else { Some(p) })
            .flatten()
    }};
}

macro_rules! children {
    ($node:ident, $font_size:ident, $paragraphs:ident, $paragraph:ident, $attrs:expr, $list_state:ident) => {{
        $node.children.into_iter().try_for_each(|child| {
            add_node(
                child,
                $font_size,
                $paragraphs,
                $paragraph,
                $attrs,
                $list_state,
            )
        })
    }};
}

/// Parse raw markdown text and get a vec of words.
pub fn parse<'s>(
    text: &str,
    font_size: &FontSize,
    mut attrs: Attrs<'s>,
) -> Result<Vec<Paragraph<'s>>, Error> {
    let parse_options = ParseOptions {
        constructs: Constructs::gfm(),
        ..Default::default()
    };
    let node = to_mdast(text, &parse_options).map_err(Error::Md)?;
    let mut paragraphs = vec![];
    let mut paragraph = None;
    add_node(
        node,
        font_size,
        &mut paragraphs,
        &mut paragraph,
        &mut attrs,
        None,
    )?;
    // Add the last paragraph.
    if let Some(paragraph) = paragraph
        && !paragraph.spans.is_empty()
    {
        paragraphs.push(paragraph);
    }
    Ok(paragraphs)
}

/// A words from a markdown node.
fn add_node<'s>(
    node: Node,
    font_size: &FontSize,
    paragraphs: &mut Vec<Paragraph<'s>>,
    paragraph: &mut Option<Paragraph<'s>>,
    attrs: &mut Attrs<'s>,
    list_state: Option<ListState>,
) -> Result<(), Error> {
    match node {
        // Add from the root node.
        Node::Root(node) => children!(node, font_size, paragraphs, paragraph, attrs, list_state),
        // Italicize.
        Node::Emphasis(node) => {
            let mut attrs = attrs.clone();
            attrs.style = Style::Italic;
            children!(
                node, font_size, paragraphs, paragraph, &mut attrs, list_state
            )
        }
        // Embolden.
        Node::Strong(node) => {
            let mut attrs = attrs.clone();
            attrs.weight = Weight::BOLD;
            children!(
                node, font_size, paragraphs, paragraph, &mut attrs, list_state
            )
        }
        // Add some text.
        Node::Text(text) => {
            let text = match list_state {
                Some(list_state) => match list_state {
                    ListState::Unordered => format!("  • {}", text.value),
                    ListState::Ordered(o) => format!("  {o}. {}", text.value),
                },
                None => text.value,
            };
            add_span(text, font_size, attrs.clone(), paragraph);
            Ok(())
        }
        // Start a new paragraph.
        Node::Paragraph(node) => {
            start_paragraph(font_size, paragraphs, paragraph);
            children!(node, font_size, paragraphs, paragraph, attrs, list_state)
        }
        // Add a header.
        Node::Heading(node) => {
            // Headers get extra spacing above them.
            if let Some(paragraph) = paragraph_mut!(paragraph) {
                // Start a header paragraph.
                let header_paragraph = Paragraph::header(node.depth, font_size)?;
                // Set the paragraph spacing of the previous paragraph to be header spacing.
                paragraph.spacing = header_paragraph.spacing;
                // End the previous paragraph.
                paragraphs.push(paragraph.clone());
            }
            // Start the header paragraph.
            *paragraph = Some(Paragraph::header(node.depth, font_size)?);
            // Headers are always bold.
            let mut attrs = attrs.clone();
            attrs.weight = Weight::BOLD;
            children!(
                node, font_size, paragraphs, paragraph, &mut attrs, list_state
            )
        }
        Node::List(node) => {
            // Add a little extra spacing to start the list.
            if let Some(paragraph) = paragraph_mut!(paragraph) {
                paragraph.spacing += (paragraph.metrics.font_size * 0.5) as usize;
            }
            start_paragraph(font_size, paragraphs, paragraph);
            // Add the nodes, using the list order.
            for (i, child) in node.children.into_iter().enumerate() {
                let list_state = match node.start {
                    Some(start) => ListState::Ordered(start + i as u32),
                    None => ListState::Unordered,
                };
                add_node(
                    child,
                    font_size,
                    paragraphs,
                    paragraph,
                    attrs,
                    Some(list_state),
                )?;
            }
            Ok(())
        }
        Node::ListItem(node) => {
            // Set the line height and paragraph spacing..
            if let Some(paragraph) = paragraph_mut!(paragraph) {
                paragraph.list_item(font_size);
            }
            children!(node, font_size, paragraphs, paragraph, attrs, list_state)
        }
        // Colorize.
        Node::Html(node) => parse_html(node, attrs),
        other => {
            let s = other.to_string();
            Err(Error::Node(s))
        }
    }
}

/// End the current paragraph.
fn end_paragraph<'s>(paragraphs: &mut Vec<Paragraph<'s>>, paragraph: &mut Option<Paragraph<'s>>) {
    if let Some(paragraph) = &paragraph
        && !paragraph.spans.is_empty()
    {
        paragraphs.push(paragraph.clone());
    }
}

/// End the current paragraph and start a new text paragraph.
fn start_paragraph<'s>(
    font_size: &FontSize,
    paragraphs: &mut Vec<Paragraph<'s>>,
    paragraph: &mut Option<Paragraph<'s>>,
) {
    end_paragraph(paragraphs, paragraph);
    // Start a new paragraph.
    *paragraph = Some(Paragraph::text(font_size));
}

/// Add a new span to the paragraph.
fn add_span<'s>(
    text: String,
    font_size: &FontSize,
    attrs: Attrs<'s>,
    paragraph: &mut Option<Paragraph<'s>>,
) {
    let span = Span { text, attrs };
    match paragraph.as_mut() {
        // Add a span to an existing paragraph.
        Some(paragraph) => {
            paragraph.spans.push(span);
        }
        // Start a new paragraph and add the span to it.
        None => {
            let mut p = Paragraph::text(font_size);
            p.spans.push(span);
            *paragraph = Some(p);
        }
    }
}

/// Parse an HTML node.
///
/// An HTML node contains the tag, not the inner text.
/// For example, `<span>text</span>` parses as three nodes:
///
/// 1. <span> (HTML)
/// 2. text (Text)
/// 3. </span> (HTML)
///
/// So, we look for two tags:
///
/// - If we see a `<span>` we look for a `color` attribute and set `attrs.color_opt` accordingly.
/// - If we see a `</span>` we reset `attrs.color_opt` to the default color.
/// - If we see any other tag, return an error.
fn parse_html(html: Html, attrs: &mut Attrs<'_>) -> Result<(), Error> {
    // Reset the color.
    if html.value.as_str() == "</span>" {
        attrs.color_opt = Some(Color::rgb(0, 0, 0));
    } else {
        let fragment = scraper::Html::parse_fragment(&html.value);
        // This should always work.
        let selector = Selector::parse("span").map_err(|_| Error::SpanSelector)?;
        let q = fragment
            .select(&selector)
            .next()
            .ok_or(Error::NotSpan(html.value.clone()))?;
        let color = q
            .attr("color")
            .ok_or(Error::NoSpanColor(html.value.clone()))?;
        // Parse the color.
        let color = HexColor::parse_rgba(color).map_err(Error::InvalidSpanColor)?;
        // Set the color.
        attrs.color_opt = Some(Color::rgba(color.r, color.g, color.b, color.a));
    }
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_span() {
        let attrs = Attrs::new();
        let font_size = FontSize::new(12);
        parse(
            "<span color=\"#FF0000FF\">colorized</span>",
            &font_size,
            attrs.clone(),
        )
        .unwrap();
        parse(
            "<span color = \"#FF0000FF\">colorized</span>",
            &font_size,
            attrs.clone(),
        )
        .unwrap();
        assert!(parse("<span color=\"\">bad</span>", &font_size, attrs.clone()).is_err());
        assert!(
            parse(
                "<span color=\"#FF0000\">bad</span>",
                &font_size,
                attrs.clone()
            )
            .is_err()
        );
        parse(
            "<span color=\"#FF0000FF\">colorized</span>",
            &font_size,
            attrs.clone(),
        )
        .unwrap();
        parse(
            "<span color=\"#FF0000FF\"></span>",
            &font_size,
            attrs.clone(),
        )
        .unwrap();
        parse(
            "This is **valid** <span color=\"#FF0000FF\">colorized</span> text!",
            &font_size,
            attrs.clone(),
        )
        .unwrap();
        parse(
            "<span color=\"#FF0000FF\"></span>",
            &font_size,
            attrs.clone(),
        )
        .unwrap();
        assert!(
            parse(
                "<span color=\"not a color\">bad</span>",
                &font_size,
                attrs.clone()
            )
            .is_err()
        );
        assert!(parse("<span>no color</span>", &font_size, attrs.clone()).is_err());
        assert!(
            parse(
                "<p color=\"#FF0000FF\">invalid_tag</p>",
                &font_size,
                attrs.clone()
            )
            .is_err()
        );
        parse(
            "<span color=\"#FF0000FF\", extra_attrib=\"a\">colorized</span>",
            &font_size,
            attrs.clone(),
        )
        .unwrap();
    }
}
