mod span;
mod style;
mod error;

use crate::md::style::{List, RegularStyle};
use markdown::{Constructs, ParseOptions, mdast::Node, to_mdast};
pub use span::Span;
pub use style::Style;
use crate::md::error::Error;

macro_rules! children {
    ($node:ident, $spans:ident, $style:ident) => {{
        $node
            .children
            .into_iter()
            .try_for_each(|child| Self::add_node(child, $spans, $style.clone()))
    }};
}

macro_rules! children_style {
    ($node:ident, $spans:ident, $style:ident, $format:ident, $value:expr) => {{
        let mut style = $style.clone();
        style = Style::Regular(match style {
            Style::Regular(mut style) => {
                style.$format = $value;
                style
            }
            _ => {
                let mut style = RegularStyle::default();
                style.$format = $value;
                style
            }
        });
        children!($node, $spans, style)
    }};
}

pub struct MarkdownText(pub Vec<Span>);

impl MarkdownText {
    /// Parse raw markdown text and get a vec of words.
    pub fn parse(text: &str) -> Result<Self, Error> {
        let parse_options = ParseOptions {
            constructs: Constructs::gfm(),
            ..Default::default()
        };
        let node = to_mdast(text, &parse_options).map_err(Error::Md)?;
        let mut spans = vec![];
        // Add the words as nodes.
        Self::add_node(node, &mut spans, Style::default())?;
        Ok(Self(spans))
    }

    /// A words from a markdown node.
    fn add_node(node: Node, spans: &mut Vec<Span>, style: Style) -> Result<(), Error> {
        match node {
            // Add from the root node.
            Node::Root(node) => children!(node, spans, style),
            Node::InlineCode(node) => {
                spans.push(Span {
                    text: Some(node.value),
                    style: Style::InlineCode,
                });
                Ok(())
            }
            Node::Emphasis(node) => children_style!(node, spans, style, italic, true),
            Node::Strong(node) => children_style!(node, spans, style, bold, true),
            Node::Text(text) => {
                spans.push(Span {
                    text: Some(text.value),
                    style,
                });
                Ok(())
            }
            Node::Paragraph(node) => children!(node, spans, style),
            Node::List(node) => {
                children_style!(node, spans, style, list, Some(if node.ordered {
                    List::Ordered
                } else {
                    List::Unordered
                }))
            }
            Node::Delete(node) => children_style!(node, spans, style, strikethrough, true),
            Node::ListItem(node) => children!(node, spans, style),
            Node::Table(_) => todo!("table"),
            Node::Blockquote(_) => todo!("blockquote"),
            Node::Break(node) => {
                spans.push(Span {
                    text: None,
                    style: Style::Break
                });
                Ok(())
            }
            Node::Code(node) => {
                spans.push(Span {
                    text: Some(node.value),
                    style: Style::Code
                });
                Ok(())
            }
            Node::Link(node) => children_style!(node, spans, style, link, Some(node.url)),
            other => {
                let s = other.to_string();
                Err(Error::Node(s))
            }
        }
    }
}
