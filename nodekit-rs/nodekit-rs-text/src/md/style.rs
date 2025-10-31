#[derive(Eq, PartialEq, Copy, Clone, Debug, Default)]
pub enum List {
    #[default]
    Ordered,
    Unordered,
}

#[derive(Eq, PartialEq, Clone, Debug, Default)]
pub struct RegularStyle {
    pub bold: bool,
    pub italic: bool,
    pub strikethrough: bool,
    pub link: Option<String>,
    pub list: Option<List>,
}

#[derive(Eq, PartialEq, Clone, Debug)]
pub enum Style {
    Regular(RegularStyle),
    InlineCode,
    Code,
    Break
}

impl Default for Style {
    fn default() -> Self {
        Self::Regular(RegularStyle::default())
    }
}
