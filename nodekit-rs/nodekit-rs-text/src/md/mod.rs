mod span;
mod font_size;
mod list_state;

use cosmic_text::{Attrs, Family, Style, Weight};
use markdown::{Constructs, ParseOptions, mdast::Node, to_mdast};
pub use span::Span;
pub(crate) use font_size::*;
use crate::error::Error;
use crate::md::list_state::ListState;

macro_rules! children {
    ($node:ident, $spans:ident, $attrs:ident, $para:ident, $list:ident) => {{
        $node
            .children
            .into_iter()
            .try_for_each(|child| add_node(child, $spans, $attrs.clone(), $para, $list))
    }};
}

macro_rules! code {
    ($node:ident, $spans:ident, $attrs:ident) => {{
        let mut attrs = $attrs.clone();
        attrs.family = Family::Monospace;
        $spans.push(Span {
            text: $node.value,
            attrs,
        });
        Ok(())
    }};
}

/// Parse raw markdown text and get a vec of words.
pub fn parse<'s>(text: &str, attrs: Attrs<'s>) -> Result<Vec<Span<'s>>, Error> {
    let parse_options = ParseOptions {
        constructs: Constructs::gfm(),
        ..Default::default()
    };
    let node = to_mdast(text, &parse_options).map_err(Error::Md)?;
    let mut spans = vec![];
    // Add the words as nodes.
    let mut first_paragraph = true;
    add_node(node, &mut spans, attrs, &mut first_paragraph, None)?;
    Ok(spans)
}

/// A words from a markdown node.
fn add_node<'s>(node: Node, spans: &mut Vec<Span<'s>>, attrs: Attrs<'s>, first_paragraph: &mut bool, list: Option<ListState>) -> Result<(), Error> {
    match node {
        // Add from the root node.
        Node::Root(node) => children!(node, spans, attrs, first_paragraph, list),
        Node::InlineCode(node) => code!(node, spans, attrs),
        Node::Emphasis(node) => {
            let mut attrs = attrs.clone();
            attrs.style = Style::Italic;
            children!(node, spans, attrs, first_paragraph, list)
        },
        Node::Strong(node) => {
            let mut attrs = attrs.clone();
            attrs.weight = Weight::BOLD;
            children!(node, spans, attrs, first_paragraph, list)
        },
        Node::Text(text) => {
            let text = match list {
                Some(list) => match list {
                    ListState::Unordered => format!("  • {}", text.value),
                    ListState::Ordered(o) => format!("  {o}. {}", text.value)
                }
                None => text.value
            };
            spans.push(Span {
                text,
                attrs: attrs.clone(),
            });
            Ok(())
        }
        Node::Paragraph(node) => {
            start_paragraph(spans, attrs.clone(), first_paragraph);
            children!(node, spans, attrs, first_paragraph, list)
        },
        Node::Heading(node) => {
            let mut attrs = attrs.clone();
            attrs.metrics_opt = Some(header_metrics(node.depth)?.into());
            children!(node, spans, attrs, first_paragraph, list)
        },
        Node::List(node) => {
            start_paragraph(spans, attrs.clone(), first_paragraph);
            for (i, child) in node.children.into_iter().enumerate() {
                let list = match node.start {
                    Some(start) => ListState::Ordered(start + i as u32),
                    None => ListState::Unordered
                };
                add_node(child, spans, attrs.clone(), first_paragraph, Some(list))?;
            }
            Ok(())
        }
        Node::ListItem(node) => children!(node, spans, attrs, first_paragraph, list),
        Node::Code(node) => code!(node, spans, attrs),
        Node::Link(node) => children!(node, spans, attrs, first_paragraph, list),
        other => {
            let s = other.to_string();
            Err(Error::Node(s))
        }
    }
}

fn start_paragraph<'s>(spans: &mut Vec<Span<'s>>, attrs: Attrs<'s>, first_paragraph: &mut bool) {
    if *first_paragraph {
        *first_paragraph = false;
    }
    else {
        // Line break.
        spans.push(Span {
            text: "\n\n".to_string(),
            attrs: attrs.clone(),
        });
    }
}
