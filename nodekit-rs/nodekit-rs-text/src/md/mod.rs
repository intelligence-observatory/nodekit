mod font_size;
mod list_state;
mod paragraph;
mod span;

use crate::error::Error;
use crate::md::list_state::ListState;
use crate::md::paragraph::Paragraph;
use cosmic_text::{Attrs, Family, Style, Weight};
pub(crate) use font_size::*;
use markdown::{Constructs, ParseOptions, mdast::Node, to_mdast};
pub use span::Span;

macro_rules! children {
    ($node:ident, $paragraphs:ident, $paragraph:ident, $attrs:ident) => {{
        $node
            .children
            .into_iter()
            .try_for_each(|child| add_node(child, $paragraphs, $paragraph, $attrs.clone()))
    }};
}

/// Parse raw markdown text and get a vec of words.
pub fn parse<'s>(text: &str, attrs: Attrs<'s>) -> Result<Vec<Paragraph<'s>>, Error> {
    let parse_options = ParseOptions {
        constructs: Constructs::gfm(),
        ..Default::default()
    };
    let node = to_mdast(text, &parse_options).map_err(Error::Md)?;
    let mut paragraphs = vec![];
    let mut paragraph = None;
    add_node(node, &mut paragraphs, &mut paragraph, attrs)?;
    // Add the last paragraph.
    if let Some(paragraph) = paragraph {
        paragraphs.push(paragraph);
    }
    Ok(paragraphs)
}

/// A words from a markdown node.
fn add_node<'s>(
    node: Node,
    paragraphs: &mut Vec<Paragraph<'s>>,
    paragraph: &mut Option<Paragraph<'s>>,
    attrs: Attrs<'s>,
) -> Result<(), Error> {
    match node {
        // Add from the root node.
        Node::Root(node) => children!(node, paragraphs, paragraph, attrs),
        Node::InlineCode(node) => {
            let mut attrs = attrs.clone();
            attrs.family = Family::Monospace;
            add_span(node.value, attrs, paragraph);
            Ok(())
        }
        Node::Emphasis(node) => {
            let mut attrs = attrs.clone();
            attrs.style = Style::Italic;
            children!(node, paragraphs, paragraph, attrs)
        }
        Node::Strong(node) => {
            let mut attrs = attrs.clone();
            attrs.weight = Weight::BOLD;
            children!(node, paragraphs, paragraph, attrs)
        }
        Node::Text(text) => {
            add_span(text.value, attrs, paragraph);
            Ok(())
        }
        Node::Paragraph(node) => {
            start_paragraph(paragraphs, paragraph);
            children!(node, paragraphs, paragraph, attrs)
        }
        Node::Heading(node) => {
            // Start a paragraph.
            start_paragraph(paragraphs, paragraph);
            // Set the header metrics.
            if let Some(paragraph) = paragraph {
                paragraph.metrics = header_metrics(node.depth)?;
            }
            children!(node, paragraphs, paragraph, attrs)
        }
        Node::List(node) => {
            start_paragraph(paragraphs, paragraph);
            let mut list_states = Vec::default();
            // Add the nodes, using the list order.
            for (i, child) in node.children.into_iter().enumerate() {
                list_states.push(match node.start {
                    Some(start) => ListState::Ordered(start + i as u32),
                    None => ListState::Unordered,
                });
                add_node(child, paragraphs, paragraph, attrs.clone())?;
            }
            // List states per span.
            if let Some(paragraph) = paragraph.as_mut() {
                paragraph.list_states = Some(list_states);
            }
            Ok(())
        }
        Node::ListItem(node) => children!(node, paragraphs, paragraph, attrs),
        Node::Code(node) => {
            // End the current paragraph.
            if let Some(paragraph) = &paragraph {
                paragraphs.push(paragraph.clone());
            }
            // Monospace block.
            let mut p = Paragraph::default();
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
        Node::Link(node) => children!(node, paragraphs, paragraph, attrs),
        other => {
            let s = other.to_string();
            Err(Error::Node(s))
        }
    }
}

fn start_paragraph<'s>(paragraphs: &mut Vec<Paragraph<'s>>, paragraph: &mut Option<Paragraph<'s>>) {
    // End the current paragraph.
    if let Some(paragraph) = &paragraph {
        paragraphs.push(paragraph.clone());
    }
    // Start a new paragraph.
    *paragraph = Some(Paragraph::default());
}

fn add_span<'s>(text: String, attrs: Attrs<'s>, paragraph: &mut Option<Paragraph<'s>>) {
    let span = Span { text, attrs };
    match paragraph.as_mut() {
        Some(paragraph) => {
            paragraph.spans.push(span);
        }
        None => {
            let mut p = Paragraph::default();
            p.spans.push(span);
            *paragraph = Some(p);
        }
    }
}

/*
                // Possibly format the text as a list.
                   let text = match paragraph.list_state.as_ref() {
                       Some(list_state) => match list_state {
                           ListState::Unordered => format!("  • {}", text.value),
                           ListState::Ordered(o) => format!("  {o}. {}", text.value),
                       },
                       None => text.value,
                   };
*/
