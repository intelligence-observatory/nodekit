mod font_size;
mod list_state;
mod paragraph;
mod span;

use crate::error::Error;
pub(crate) use crate::md::list_state::ListState;
use crate::md::paragraph::Paragraph;
use cosmic_text::{Attrs, Family, Style, Weight};
pub(crate) use font_size::*;
use markdown::{Constructs, ParseOptions, mdast::Node, to_mdast};
pub use span::Span;

macro_rules! children {
    ($node:ident, $font_size:ident, $paragraphs:ident, $paragraph:ident, $attrs:ident, $list_state:ident) => {{
        $node.children.into_iter().try_for_each(|child| {
            add_node(
                child,
                $font_size,
                $paragraphs,
                $paragraph,
                $attrs.clone(),
                $list_state,
            )
        })
    }};
}

/// Parse raw markdown text and get a vec of words.
pub fn parse<'s>(
    text: &str,
    font_size: &FontSize,
    attrs: Attrs<'s>,
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
        attrs,
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
    attrs: Attrs<'s>,
    list_state: Option<ListState>,
) -> Result<(), Error> {
    match node {
        // Add from the root node.
        Node::Root(node) => children!(node, font_size, paragraphs, paragraph, attrs, list_state),
        Node::InlineCode(node) => {
            let mut attrs = attrs.clone();
            attrs.family = Family::Monospace;
            add_span(node.value, font_size, attrs, paragraph);
            Ok(())
        }
        Node::Emphasis(node) => {
            let mut attrs = attrs.clone();
            attrs.style = Style::Italic;
            children!(node, font_size, paragraphs, paragraph, attrs, list_state)
        }
        Node::Strong(node) => {
            let mut attrs = attrs.clone();
            attrs.weight = Weight::BOLD;
            children!(node, font_size, paragraphs, paragraph, attrs, list_state)
        }
        Node::Text(text) => {
            let text = match list_state {
                Some(list_state) => match list_state {
                    ListState::Unordered => format!("  • {}", text.value),
                    ListState::Ordered(o) => format!("  {o}. {}", text.value),
                },
                None => text.value,
            };
            add_span(text, font_size, attrs, paragraph);
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
            children!(node, font_size, paragraphs, paragraph, attrs, list_state)
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
                    attrs.clone(),
                    Some(list_state),
                )?;
            }
            Ok(())
        }
        Node::ListItem(node) => {
            children!(node, font_size, paragraphs, paragraph, attrs, list_state)
        }
        Node::Code(node) => {
            // End the current paragraph.
            if let Some(paragraph) = &paragraph {
                paragraphs.push(paragraph.clone());
            }
            // Monospace block.
            let mut p = Paragraph::from(font_size);
            let mut attrs = attrs.clone();
            attrs.family = Family::Monospace;
            p.spans.push(Span {
                text: node.value,
                attrs,
            });
            // Start a new paragraph.
            *paragraph = Some(p);
            Ok(())
        }
        Node::Link(node) => children!(node, font_size, paragraphs, paragraph, attrs, list_state),
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
