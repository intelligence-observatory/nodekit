mod font_size;
mod list_state;
mod paragraph;
mod span;

use crate::error::Error;
pub(crate) use crate::md::list_state::ListState;
use crate::md::paragraph::Paragraph;
use cosmic_text::{Attrs, Color, Style, Weight};
use hex_color::HexColor;
pub(crate) use font_size::*;
use markdown::{Constructs, ParseOptions, mdast::Node, to_mdast};
use pyo3::impl_::pymethods::IterBaseKind;
use tl::queryselector::iterable::QueryIterable;
use tl::VDom;
pub use span::Span;

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
    if let Some(paragraph) = paragraph {
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
        Node::Emphasis(node) => {
            let mut attrs = attrs.clone();
            attrs.style = Style::Italic;
            children!(node, font_size, paragraphs, paragraph, &mut attrs, list_state)
        }
        Node::Strong(node) => {
            let mut attrs = attrs.clone();
            attrs.weight = Weight::BOLD;
            children!(node, font_size, paragraphs, paragraph, &mut attrs, list_state)
        }
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
        Node::Paragraph(node) => {
            start_paragraph(font_size, paragraphs, paragraph);
            children!(node, font_size, paragraphs, paragraph, attrs, list_state)
        }
        Node::Heading(node) => {
            // Start a paragraph.
            start_paragraph(font_size, paragraphs, paragraph);
            // Set the header metrics.
            if let Some(paragraph) = paragraph {
                paragraph.metrics = font_size.header_metrics(node.depth)?;
            }
            let mut attrs = attrs.clone();
            attrs.weight = Weight::BOLD;
            children!(node, font_size, paragraphs, paragraph, &mut attrs, list_state)
        }
        Node::List(node) => {
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
            children!(node, font_size, paragraphs, paragraph, attrs, list_state)
        }
        Node::Html(node ) => {
            let dom = tl::parse(&node.value, tl::ParserOptions::default()).map_err(Error::Html)?;
            let parser = dom.parser();
            let mut span = dom.query_selector("span").ok_or(Error::NotSpan(node.value.to_string()))?;
            if let Some(span) = span.next() && let Some(span) = span.get(parser) {
                let tag = span.as_tag().ok_or(Error::NotSpan(node.value.to_string()))?;
                let color = tag.attributes().get("color").flatten().ok_or(Error::NoSpanColor(node.value.to_string()))?.as_utf8_str();
                let color = HexColor::parse(color.as_ref()).map_err(Error::InvalidColor)?;
                attrs.color_opt = Some(Color(color.to_u32()));
            }
            else {
                attrs.color_opt = Some(Color::rgb(0, 0, 0));
            }
            Ok(())
        },
        other => {
            let s = other.to_string();
            Err(Error::Node(s))
        }
    }
}

fn start_paragraph<'s>(
    font_size: &FontSize,
    paragraphs: &mut Vec<Paragraph<'s>>,
    paragraph: &mut Option<Paragraph<'s>>,
) {
    // End the current paragraph.
    if let Some(paragraph) = &paragraph
        && !paragraph.spans.is_empty()
    {
        paragraphs.push(paragraph.clone());
    }
    // Start a new paragraph.
    *paragraph = Some(font_size.into());
}

fn add_span<'s>(
    text: String,
    font_size: &FontSize,
    attrs: Attrs<'s>,
    paragraph: &mut Option<Paragraph<'s>>,
) {
    let span = Span { text, attrs };
    match paragraph.as_mut() {
        Some(paragraph) => {
            paragraph.spans.push(span);
        }
        None => {
            let mut p = Paragraph::from(font_size);
            p.spans.push(span);
            *paragraph = Some(p);
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_span() {
        let attrs = Attrs::new();
        let font_size = FontSize::new(12);
        parse("<span color=\"#FF0000\">colorized</span>", &font_size, attrs.clone()).unwrap();
        parse("<span color=\"#FF0000FF\">colorized</span>", &font_size, attrs.clone()).unwrap();
        parse("<span color=\"#FF0000\"></span>", &font_size, attrs.clone()).unwrap();
        parse("This is **valid** <span color=\"#FF0000\">colorized</span> text!", &font_size, attrs.clone()).unwrap();
        parse("<span color=\"#FF0000\"></span>", &font_size, attrs.clone()).unwrap();
        assert!(parse("<span color=\"not a color\">bad</span>", &font_size, attrs.clone()).is_err());
        assert!(parse("<span>no color</span>", &font_size, attrs.clone()).is_err());
        assert!(parse("<invalid_tag color=\"#FF0000\">invalid_tag</invalid_tag>", &font_size, attrs.clone()).is_err());
        parse("<span color=\"#FF0000\", extra_attrib=\"a\">colorized</span>", &font_size, attrs.clone()).unwrap();
    }
}