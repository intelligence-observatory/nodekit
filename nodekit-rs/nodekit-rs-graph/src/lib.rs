#![allow(clippy::all)]
#![allow(warnings)]

#[doc = r" Error types."]
pub mod error {
    #[doc = r" Error from a `TryFrom` or `FromStr` implementation."]
    pub struct ConversionError(::std::borrow::Cow<'static, str>);
    impl ::std::error::Error for ConversionError {}
    impl ::std::fmt::Display for ConversionError {
        fn fmt(&self, f: &mut ::std::fmt::Formatter<'_>) -> Result<(), ::std::fmt::Error> {
            ::std::fmt::Display::fmt(&self.0, f)
        }
    }
    impl ::std::fmt::Debug for ConversionError {
        fn fmt(&self, f: &mut ::std::fmt::Formatter<'_>) -> Result<(), ::std::fmt::Error> {
            ::std::fmt::Debug::fmt(&self.0, f)
        }
    }
    impl From<&'static str> for ConversionError {
        fn from(value: &'static str) -> Self {
            Self(value.into())
        }
    }
    impl From<String> for ConversionError {
        fn from(value: String) -> Self {
            Self(value.into())
        }
    }
}
#[doc = "`AssetLocator`"]
#[doc = r""]
#[doc = r" <details><summary>JSON schema</summary>"]
#[doc = r""]
#[doc = r" ```json"]
#[doc = "{"]
#[doc = "  \"oneOf\": ["]
#[doc = "    {"]
#[doc = "      \"$ref\": \"#/$defs/FileSystemPath\""]
#[doc = "    },"]
#[doc = "    {"]
#[doc = "      \"$ref\": \"#/$defs/ZipArchiveInnerPath\""]
#[doc = "    },"]
#[doc = "    {"]
#[doc = "      \"$ref\": \"#/$defs/RelativePath\""]
#[doc = "    },"]
#[doc = "    {"]
#[doc = "      \"$ref\": \"#/$defs/URL\""]
#[doc = "    }"]
#[doc = "  ],"]
#[doc = "  \"discriminator\": {"]
#[doc = "    \"mapping\": {"]
#[doc = "      \"FileSystemPath\": \"#/$defs/FileSystemPath\","]
#[doc = "      \"RelativePath\": \"#/$defs/RelativePath\","]
#[doc = "      \"URL\": \"#/$defs/URL\","]
#[doc = "      \"ZipArchiveInnerPath\": \"#/$defs/ZipArchiveInnerPath\""]
#[doc = "    },"]
#[doc = "    \"propertyName\": \"locator_type\""]
#[doc = "  }"]
#[doc = "}"]
#[doc = r" ```"]
#[doc = r" </details>"]
#[derive(:: serde :: Deserialize, :: serde :: Serialize, Clone, Debug)]
#[serde(untagged)]
pub enum AssetLocator {
    FileSystemPath(FileSystemPath),
    ZipArchiveInnerPath(ZipArchiveInnerPath),
    RelativePath(RelativePath),
    Url(Url),
}
impl ::std::convert::From<&Self> for AssetLocator {
    fn from(value: &AssetLocator) -> Self {
        value.clone()
    }
}
impl ::std::convert::From<FileSystemPath> for AssetLocator {
    fn from(value: FileSystemPath) -> Self {
        Self::FileSystemPath(value)
    }
}
impl ::std::convert::From<ZipArchiveInnerPath> for AssetLocator {
    fn from(value: ZipArchiveInnerPath) -> Self {
        Self::ZipArchiveInnerPath(value)
    }
}
impl ::std::convert::From<RelativePath> for AssetLocator {
    fn from(value: RelativePath) -> Self {
        Self::RelativePath(value)
    }
}
impl ::std::convert::From<Url> for AssetLocator {
    fn from(value: Url) -> Self {
        Self::Url(value)
    }
}
#[doc = "The background color of the entry field."]
#[doc = r""]
#[doc = r" <details><summary>JSON schema</summary>"]
#[doc = r""]
#[doc = r" ```json"]
#[doc = "{"]
#[doc = "  \"title\": \"Background Color\","]
#[doc = "  \"description\": \"The background color of the entry field.\","]
#[doc = "  \"default\": \"#ffffff\","]
#[doc = "  \"type\": \"string\","]
#[doc = "  \"maxLength\": 9,"]
#[doc = "  \"minLength\": 9,"]
#[doc = "  \"pattern\": \"^#[0-9a-f]{8}$\""]
#[doc = "}"]
#[doc = r" ```"]
#[doc = r" </details>"]
#[derive(:: serde :: Serialize, Clone, Debug, Eq, Hash, Ord, PartialEq, PartialOrd)]
#[serde(transparent)]
pub struct BackgroundColor(::std::string::String);
impl ::std::ops::Deref for BackgroundColor {
    type Target = ::std::string::String;
    fn deref(&self) -> &::std::string::String {
        &self.0
    }
}
impl ::std::convert::From<BackgroundColor> for ::std::string::String {
    fn from(value: BackgroundColor) -> Self {
        value.0
    }
}
impl ::std::convert::From<&BackgroundColor> for BackgroundColor {
    fn from(value: &BackgroundColor) -> Self {
        value.clone()
    }
}
impl ::std::default::Default for BackgroundColor {
    fn default() -> Self {
        BackgroundColor("#ffffff".to_string())
    }
}
impl ::std::str::FromStr for BackgroundColor {
    type Err = self::error::ConversionError;
    fn from_str(value: &str) -> ::std::result::Result<Self, self::error::ConversionError> {
        if value.chars().count() > 9usize {
            return Err("longer than 9 characters".into());
        }
        if value.chars().count() < 9usize {
            return Err("shorter than 9 characters".into());
        }
        static PATTERN: ::std::sync::LazyLock<::regress::Regex> =
            ::std::sync::LazyLock::new(|| ::regress::Regex::new("^#[0-9a-f]{8}$").unwrap());
        if PATTERN.find(value).is_none() {
            return Err("doesn't match pattern \"^#[0-9a-f]{8}$\"".into());
        }
        Ok(Self(value.to_string()))
    }
}
impl ::std::convert::TryFrom<&str> for BackgroundColor {
    type Error = self::error::ConversionError;
    fn try_from(value: &str) -> ::std::result::Result<Self, self::error::ConversionError> {
        value.parse()
    }
}
impl ::std::convert::TryFrom<&::std::string::String> for BackgroundColor {
    type Error = self::error::ConversionError;
    fn try_from(
        value: &::std::string::String,
    ) -> ::std::result::Result<Self, self::error::ConversionError> {
        value.parse()
    }
}
impl ::std::convert::TryFrom<::std::string::String> for BackgroundColor {
    type Error = self::error::ConversionError;
    fn try_from(
        value: ::std::string::String,
    ) -> ::std::result::Result<Self, self::error::ConversionError> {
        value.parse()
    }
}
impl<'de> ::serde::Deserialize<'de> for BackgroundColor {
    fn deserialize<D>(deserializer: D) -> ::std::result::Result<Self, D::Error>
    where
        D: ::serde::Deserializer<'de>,
    {
        ::std::string::String::deserialize(deserializer)?
            .parse()
            .map_err(|e: self::error::ConversionError| {
                <D::Error as ::serde::de::Error>::custom(e.to_string())
            })
    }
}
#[doc = "The color of the Board during this Node (the \"background color\")."]
#[doc = r""]
#[doc = r" <details><summary>JSON schema</summary>"]
#[doc = r""]
#[doc = r" ```json"]
#[doc = "{"]
#[doc = "  \"title\": \"Board Color\","]
#[doc = "  \"description\": \"The color of the Board during this Node (the \\\"background color\\\").\","]
#[doc = "  \"default\": \"#808080ff\","]
#[doc = "  \"type\": \"string\","]
#[doc = "  \"maxLength\": 9,"]
#[doc = "  \"minLength\": 9,"]
#[doc = "  \"pattern\": \"^#[0-9a-f]{8}$\""]
#[doc = "}"]
#[doc = r" ```"]
#[doc = r" </details>"]
#[derive(:: serde :: Serialize, Clone, Debug, Eq, Hash, Ord, PartialEq, PartialOrd)]
#[serde(transparent)]
pub struct BoardColor(::std::string::String);
impl ::std::ops::Deref for BoardColor {
    type Target = ::std::string::String;
    fn deref(&self) -> &::std::string::String {
        &self.0
    }
}
impl ::std::convert::From<BoardColor> for ::std::string::String {
    fn from(value: BoardColor) -> Self {
        value.0
    }
}
impl ::std::convert::From<&BoardColor> for BoardColor {
    fn from(value: &BoardColor) -> Self {
        value.clone()
    }
}
impl ::std::default::Default for BoardColor {
    fn default() -> Self {
        BoardColor("#808080ff".to_string())
    }
}
impl ::std::str::FromStr for BoardColor {
    type Err = self::error::ConversionError;
    fn from_str(value: &str) -> ::std::result::Result<Self, self::error::ConversionError> {
        if value.chars().count() > 9usize {
            return Err("longer than 9 characters".into());
        }
        if value.chars().count() < 9usize {
            return Err("shorter than 9 characters".into());
        }
        static PATTERN: ::std::sync::LazyLock<::regress::Regex> =
            ::std::sync::LazyLock::new(|| ::regress::Regex::new("^#[0-9a-f]{8}$").unwrap());
        if PATTERN.find(value).is_none() {
            return Err("doesn't match pattern \"^#[0-9a-f]{8}$\"".into());
        }
        Ok(Self(value.to_string()))
    }
}
impl ::std::convert::TryFrom<&str> for BoardColor {
    type Error = self::error::ConversionError;
    fn try_from(value: &str) -> ::std::result::Result<Self, self::error::ConversionError> {
        value.parse()
    }
}
impl ::std::convert::TryFrom<&::std::string::String> for BoardColor {
    type Error = self::error::ConversionError;
    fn try_from(
        value: &::std::string::String,
    ) -> ::std::result::Result<Self, self::error::ConversionError> {
        value.parse()
    }
}
impl ::std::convert::TryFrom<::std::string::String> for BoardColor {
    type Error = self::error::ConversionError;
    fn try_from(
        value: ::std::string::String,
    ) -> ::std::result::Result<Self, self::error::ConversionError> {
        value.parse()
    }
}
impl<'de> ::serde::Deserialize<'de> for BoardColor {
    fn deserialize<D>(deserializer: D) -> ::std::result::Result<Self, D::Error>
    where
        D: ::serde::Deserializer<'de>,
    {
        ::std::string::String::deserialize(deserializer)?
            .parse()
            .map_err(|e: self::error::ConversionError| {
                <D::Error as ::serde::de::Error>::custom(e.to_string())
            })
    }
}
#[doc = "`ClickSensor`"]
#[doc = r""]
#[doc = r" <details><summary>JSON schema</summary>"]
#[doc = r""]
#[doc = r" ```json"]
#[doc = "{"]
#[doc = "  \"title\": \"ClickSensor\","]
#[doc = "  \"type\": \"object\","]
#[doc = "  \"required\": ["]
#[doc = "    \"h\","]
#[doc = "    \"w\","]
#[doc = "    \"x\","]
#[doc = "    \"y\""]
#[doc = "  ],"]
#[doc = "  \"properties\": {"]
#[doc = "    \"end_msec\": {"]
#[doc = "      \"title\": \"End Msec\","]
#[doc = "      \"description\": \"The time (in milliseconds) relative to Node start when the Sensor is disarmed. If None, the Sensor remains armed until the Node ends.\","]
#[doc = "      \"default\": null,"]
#[doc = "      \"anyOf\": ["]
#[doc = "        {"]
#[doc = "          \"description\": \"A point in time relative to the start of a Node.\","]
#[doc = "          \"type\": \"integer\","]
#[doc = "          \"minimum\": 0.0"]
#[doc = "        },"]
#[doc = "        {"]
#[doc = "          \"type\": \"null\""]
#[doc = "        }"]
#[doc = "      ]"]
#[doc = "    },"]
#[doc = "    \"h\": {"]
#[doc = "      \"description\": \"The height of the bounding box of the clickable region, in Board units.\","]
#[doc = "      \"$ref\": \"#/$defs/nodekit___internal__types__common__SpatialSize__2\""]
#[doc = "    },"]
#[doc = "    \"mask\": {"]
#[doc = "      \"title\": \"Mask\","]
#[doc = "      \"description\": \"The shape of the clickable region. \\\"rectangle\\\" uses the box itself; \\\"ellipse\\\" inscribes an ellipse within the box.\","]
#[doc = "      \"default\": \"rectangle\","]
#[doc = "      \"type\": \"string\","]
#[doc = "      \"enum\": ["]
#[doc = "        \"rectangle\","]
#[doc = "        \"ellipse\""]
#[doc = "      ]"]
#[doc = "    },"]
#[doc = "    \"sensor_type\": {"]
#[doc = "      \"title\": \"Sensor Type\","]
#[doc = "      \"default\": \"ClickSensor\","]
#[doc = "      \"type\": \"string\","]
#[doc = "      \"const\": \"ClickSensor\""]
#[doc = "    },"]
#[doc = "    \"start_msec\": {"]
#[doc = "      \"title\": \"Start Msec\","]
#[doc = "      \"description\": \"The time (in milliseconds) relative to Node start when the Sensor is armed.\","]
#[doc = "      \"default\": 0,"]
#[doc = "      \"type\": \"integer\","]
#[doc = "      \"minimum\": 0.0"]
#[doc = "    },"]
#[doc = "    \"w\": {"]
#[doc = "      \"description\": \"The width of the bounding box of the clickable region, in Board units.\","]
#[doc = "      \"$ref\": \"#/$defs/nodekit___internal__types__common__SpatialSize__2\""]
#[doc = "    },"]
#[doc = "    \"x\": {"]
#[doc = "      \"description\": \"The center of the bounding box of the clickable region, along the Board x-axis.\","]
#[doc = "      \"$ref\": \"#/$defs/SpatialPoint\""]
#[doc = "    },"]
#[doc = "    \"y\": {"]
#[doc = "      \"description\": \"The center of the bounding box of the clickable region, along the Board y-axis.\","]
#[doc = "      \"$ref\": \"#/$defs/SpatialPoint\""]
#[doc = "    }"]
#[doc = "  }"]
#[doc = "}"]
#[doc = r" ```"]
#[doc = r" </details>"]
#[derive(:: serde :: Deserialize, :: serde :: Serialize, Clone, Debug)]
pub struct ClickSensor {
    #[doc = "The time (in milliseconds) relative to Node start when the Sensor is disarmed. If None, the Sensor remains armed until the Node ends."]
    #[serde(default, skip_serializing_if = "::std::option::Option::is_none")]
    pub end_msec: ::std::option::Option<u64>,
    #[doc = "The height of the bounding box of the clickable region, in Board units."]
    pub h: NodekitInternalTypesCommonSpatialSize2,
    #[doc = "The shape of the clickable region. \"rectangle\" uses the box itself; \"ellipse\" inscribes an ellipse within the box."]
    #[serde(default = "defaults::click_sensor_mask")]
    pub mask: Mask,
    #[serde(default = "defaults::click_sensor_sensor_type")]
    pub sensor_type: ::std::string::String,
    #[doc = "The time (in milliseconds) relative to Node start when the Sensor is armed."]
    #[serde(default)]
    pub start_msec: u64,
    #[doc = "The width of the bounding box of the clickable region, in Board units."]
    pub w: NodekitInternalTypesCommonSpatialSize2,
    #[doc = "The center of the bounding box of the clickable region, along the Board x-axis."]
    pub x: SpatialPoint,
    #[doc = "The center of the bounding box of the clickable region, along the Board y-axis."]
    pub y: SpatialPoint,
}
impl ::std::convert::From<&ClickSensor> for ClickSensor {
    fn from(value: &ClickSensor) -> Self {
        value.clone()
    }
}
impl ClickSensor {
    pub fn builder() -> builder::ClickSensor {
        Default::default()
    }
}
#[doc = "`Effect`"]
#[doc = r""]
#[doc = r" <details><summary>JSON schema</summary>"]
#[doc = r""]
#[doc = r" ```json"]
#[doc = "{"]
#[doc = "  \"oneOf\": ["]
#[doc = "    {"]
#[doc = "      \"$ref\": \"#/$defs/HidePointerEffect\""]
#[doc = "    }"]
#[doc = "  ],"]
#[doc = "  \"discriminator\": {"]
#[doc = "    \"mapping\": {"]
#[doc = "      \"HidePointerEffect\": \"#/$defs/HidePointerEffect\""]
#[doc = "    },"]
#[doc = "    \"propertyName\": \"effect_type\""]
#[doc = "  }"]
#[doc = "}"]
#[doc = r" ```"]
#[doc = r" </details>"]
#[derive(:: serde :: Deserialize, :: serde :: Serialize, Clone, Debug)]
#[serde(transparent)]
pub struct Effect(pub HidePointerEffect);
impl ::std::ops::Deref for Effect {
    type Target = HidePointerEffect;
    fn deref(&self) -> &HidePointerEffect {
        &self.0
    }
}
impl ::std::convert::From<Effect> for HidePointerEffect {
    fn from(value: Effect) -> Self {
        value.0
    }
}
impl ::std::convert::From<&Effect> for Effect {
    fn from(value: &Effect) -> Self {
        value.clone()
    }
}
impl ::std::convert::From<HidePointerEffect> for Effect {
    fn from(value: HidePointerEffect) -> Self {
        Self(value)
    }
}
#[doc = "A locator which points to an absolute filepath on the viewer's local file system."]
#[doc = r""]
#[doc = r" <details><summary>JSON schema</summary>"]
#[doc = r""]
#[doc = r" ```json"]
#[doc = "{"]
#[doc = "  \"title\": \"FileSystemPath\","]
#[doc = "  \"description\": \"A locator which points to an absolute filepath on the viewer's local file system.\","]
#[doc = "  \"type\": \"object\","]
#[doc = "  \"required\": ["]
#[doc = "    \"path\""]
#[doc = "  ],"]
#[doc = "  \"properties\": {"]
#[doc = "    \"locator_type\": {"]
#[doc = "      \"title\": \"Locator Type\","]
#[doc = "      \"default\": \"FileSystemPath\","]
#[doc = "      \"type\": \"string\","]
#[doc = "      \"const\": \"FileSystemPath\""]
#[doc = "    },"]
#[doc = "    \"path\": {"]
#[doc = "      \"title\": \"Path\","]
#[doc = "      \"description\": \"The absolute path to the asset file in the local filesystem.\","]
#[doc = "      \"type\": \"string\","]
#[doc = "      \"format\": \"file-path\""]
#[doc = "    }"]
#[doc = "  }"]
#[doc = "}"]
#[doc = r" ```"]
#[doc = r" </details>"]
#[derive(:: serde :: Deserialize, :: serde :: Serialize, Clone, Debug)]
pub struct FileSystemPath {
    #[serde(default = "defaults::file_system_path_locator_type")]
    pub locator_type: ::std::string::String,
    #[doc = "The absolute path to the asset file in the local filesystem."]
    pub path: ::std::string::String,
}
impl ::std::convert::From<&FileSystemPath> for FileSystemPath {
    fn from(value: &FileSystemPath) -> Self {
        value.clone()
    }
}
impl FileSystemPath {
    pub fn builder() -> builder::FileSystemPath {
        Default::default()
    }
}
#[doc = "`FreeTextEntryCard`"]
#[doc = r""]
#[doc = r" <details><summary>JSON schema</summary>"]
#[doc = r""]
#[doc = r" ```json"]
#[doc = "{"]
#[doc = "  \"title\": \"FreeTextEntryCard\","]
#[doc = "  \"type\": \"object\","]
#[doc = "  \"required\": ["]
#[doc = "    \"h\","]
#[doc = "    \"w\","]
#[doc = "    \"x\","]
#[doc = "    \"y\""]
#[doc = "  ],"]
#[doc = "  \"properties\": {"]
#[doc = "    \"background_color\": {"]
#[doc = "      \"title\": \"Background Color\","]
#[doc = "      \"description\": \"The background color of the entry field.\","]
#[doc = "      \"default\": \"#ffffff\","]
#[doc = "      \"type\": \"string\","]
#[doc = "      \"maxLength\": 9,"]
#[doc = "      \"minLength\": 9,"]
#[doc = "      \"pattern\": \"^#[0-9a-f]{8}$\""]
#[doc = "    },"]
#[doc = "    \"card_type\": {"]
#[doc = "      \"title\": \"Card Type\","]
#[doc = "      \"default\": \"FreeTextEntryCard\","]
#[doc = "      \"type\": \"string\","]
#[doc = "      \"const\": \"FreeTextEntryCard\""]
#[doc = "    },"]
#[doc = "    \"end_msec\": {"]
#[doc = "      \"title\": \"End Msec\","]
#[doc = "      \"description\": \"The time (in milliseconds) relative to Node start when the Card is removed from the Board.\","]
#[doc = "      \"default\": null,"]
#[doc = "      \"anyOf\": ["]
#[doc = "        {"]
#[doc = "          \"description\": \"A point in time relative to the start of a Node.\","]
#[doc = "          \"type\": \"integer\","]
#[doc = "          \"minimum\": 0.0"]
#[doc = "        },"]
#[doc = "        {"]
#[doc = "          \"type\": \"null\""]
#[doc = "        }"]
#[doc = "      ]"]
#[doc = "    },"]
#[doc = "    \"font_size\": {"]
#[doc = "      \"description\": \"The height of the em-box, in Board units.\","]
#[doc = "      \"default\": 0.02,"]
#[doc = "      \"$ref\": \"#/$defs/nodekit___internal__types__common__SpatialSize__1\""]
#[doc = "    },"]
#[doc = "    \"h\": {"]
#[doc = "      \"description\": \"The height of the Card, in Board units.\","]
#[doc = "      \"$ref\": \"#/$defs/nodekit___internal__types__common__SpatialSize__1\""]
#[doc = "    },"]
#[doc = "    \"max_length\": {"]
#[doc = "      \"title\": \"Max Length\","]
#[doc = "      \"description\": \"The maximum number of characters the user can enter. If None, no limit.\","]
#[doc = "      \"default\": null,"]
#[doc = "      \"anyOf\": ["]
#[doc = "        {"]
#[doc = "          \"type\": \"integer\","]
#[doc = "          \"maximum\": 10000.0,"]
#[doc = "          \"minimum\": 1.0"]
#[doc = "        },"]
#[doc = "        {"]
#[doc = "          \"type\": \"null\""]
#[doc = "        }"]
#[doc = "      ]"]
#[doc = "    },"]
#[doc = "    \"prompt\": {"]
#[doc = "      \"title\": \"Prompt\","]
#[doc = "      \"description\": \"The initial placeholder text shown in the free text response box. It disappears when the user selects the element.\","]
#[doc = "      \"default\": \"\","]
#[doc = "      \"type\": \"string\""]
#[doc = "    },"]
#[doc = "    \"start_msec\": {"]
#[doc = "      \"title\": \"Start Msec\","]
#[doc = "      \"description\": \"The time (in milliseconds) relative to Node start when the Card is placed on the Board.\","]
#[doc = "      \"default\": 0,"]
#[doc = "      \"type\": \"integer\","]
#[doc = "      \"minimum\": 0.0"]
#[doc = "    },"]
#[doc = "    \"text_color\": {"]
#[doc = "      \"title\": \"Text Color\","]
#[doc = "      \"default\": \"#000000\","]
#[doc = "      \"type\": \"string\","]
#[doc = "      \"maxLength\": 9,"]
#[doc = "      \"minLength\": 9,"]
#[doc = "      \"pattern\": \"^#[0-9a-f]{8}$\""]
#[doc = "    },"]
#[doc = "    \"w\": {"]
#[doc = "      \"description\": \"The width of the Card, in Board units.\","]
#[doc = "      \"$ref\": \"#/$defs/nodekit___internal__types__common__SpatialSize__1\""]
#[doc = "    },"]
#[doc = "    \"x\": {"]
#[doc = "      \"description\": \"The x-coordinate of the Card center on the Board. 0 is the center of the Board. An increase in x moves right.\","]
#[doc = "      \"$ref\": \"#/$defs/SpatialPoint\""]
#[doc = "    },"]
#[doc = "    \"y\": {"]
#[doc = "      \"description\": \"The y-coordinate of the Card center on the Board. 0 is the center of the Board. An increase in y moves up.\","]
#[doc = "      \"$ref\": \"#/$defs/SpatialPoint\""]
#[doc = "    },"]
#[doc = "    \"z_index\": {"]
#[doc = "      \"title\": \"Z Index\","]
#[doc = "      \"default\": null,"]
#[doc = "      \"anyOf\": ["]
#[doc = "        {"]
#[doc = "          \"type\": \"integer\""]
#[doc = "        },"]
#[doc = "        {"]
#[doc = "          \"type\": \"null\""]
#[doc = "        }"]
#[doc = "      ]"]
#[doc = "    }"]
#[doc = "  }"]
#[doc = "}"]
#[doc = r" ```"]
#[doc = r" </details>"]
#[derive(:: serde :: Deserialize, :: serde :: Serialize, Clone, Debug)]
pub struct FreeTextEntryCard {
    #[doc = "The background color of the entry field."]
    #[serde(default = "defaults::free_text_entry_card_background_color")]
    pub background_color: BackgroundColor,
    #[serde(default = "defaults::free_text_entry_card_card_type")]
    pub card_type: ::std::string::String,
    #[doc = "The time (in milliseconds) relative to Node start when the Card is removed from the Board."]
    #[serde(default, skip_serializing_if = "::std::option::Option::is_none")]
    pub end_msec: ::std::option::Option<u64>,
    #[doc = "The height of the em-box, in Board units."]
    #[serde(default = "defaults::free_text_entry_card_font_size")]
    pub font_size: NodekitInternalTypesCommonSpatialSize1,
    #[doc = "The height of the Card, in Board units."]
    pub h: NodekitInternalTypesCommonSpatialSize1,
    #[doc = "The maximum number of characters the user can enter. If None, no limit."]
    #[serde(default, skip_serializing_if = "::std::option::Option::is_none")]
    pub max_length: ::std::option::Option<::std::num::NonZeroU64>,
    #[doc = "The initial placeholder text shown in the free text response box. It disappears when the user selects the element."]
    #[serde(default)]
    pub prompt: ::std::string::String,
    #[doc = "The time (in milliseconds) relative to Node start when the Card is placed on the Board."]
    #[serde(default)]
    pub start_msec: u64,
    #[serde(default = "defaults::free_text_entry_card_text_color")]
    pub text_color: TextColor,
    #[doc = "The width of the Card, in Board units."]
    pub w: NodekitInternalTypesCommonSpatialSize1,
    #[doc = "The x-coordinate of the Card center on the Board. 0 is the center of the Board. An increase in x moves right."]
    pub x: SpatialPoint,
    #[doc = "The y-coordinate of the Card center on the Board. 0 is the center of the Board. An increase in y moves up."]
    pub y: SpatialPoint,
    #[serde(default, skip_serializing_if = "::std::option::Option::is_none")]
    pub z_index: ::std::option::Option<i64>,
}
impl ::std::convert::From<&FreeTextEntryCard> for FreeTextEntryCard {
    fn from(value: &FreeTextEntryCard) -> Self {
        value.clone()
    }
}
impl FreeTextEntryCard {
    pub fn builder() -> builder::FreeTextEntryCard {
        Default::default()
    }
}
#[doc = "`Graph`"]
#[doc = r""]
#[doc = r" <details><summary>JSON schema</summary>"]
#[doc = r""]
#[doc = r" ```json"]
#[doc = "{"]
#[doc = "  \"title\": \"Graph\","]
#[doc = "  \"type\": \"object\","]
#[doc = "  \"required\": ["]
#[doc = "    \"nodes\","]
#[doc = "    \"start\","]
#[doc = "    \"transitions\""]
#[doc = "  ],"]
#[doc = "  \"properties\": {"]
#[doc = "    \"nodekit_version\": {"]
#[doc = "      \"title\": \"Nodekit Version\","]
#[doc = "      \"default\": \"0.1.0\","]
#[doc = "      \"type\": \"string\","]
#[doc = "      \"const\": \"0.1.0\""]
#[doc = "    },"]
#[doc = "    \"nodes\": {"]
#[doc = "      \"title\": \"Nodes\","]
#[doc = "      \"type\": \"object\","]
#[doc = "      \"additionalProperties\": {"]
#[doc = "        \"$ref\": \"#/$defs/Node\""]
#[doc = "      },"]
#[doc = "      \"propertyNames\": {"]
#[doc = "        \"description\": \"An identifier for a Node which is unique within a Graph.\""]
#[doc = "      }"]
#[doc = "    },"]
#[doc = "    \"start\": {"]
#[doc = "      \"title\": \"Start\","]
#[doc = "      \"description\": \"An identifier for a Node which is unique within a Graph.\","]
#[doc = "      \"type\": \"string\""]
#[doc = "    },"]
#[doc = "    \"transitions\": {"]
#[doc = "      \"title\": \"Transitions\","]
#[doc = "      \"description\": \"A mapping from (NodeId, SensorId) to the next Node that will be transitioned if the Sensor is triggered in that Node.\","]
#[doc = "      \"type\": \"object\","]
#[doc = "      \"additionalProperties\": {"]
#[doc = "        \"type\": \"object\","]
#[doc = "        \"additionalProperties\": {"]
#[doc = "          \"description\": \"An identifier for a Node which is unique within a Graph.\","]
#[doc = "          \"type\": \"string\""]
#[doc = "        },"]
#[doc = "        \"propertyNames\": {"]
#[doc = "          \"description\": \"An identifier for a Sensor which is unique within a Node.\""]
#[doc = "        }"]
#[doc = "      },"]
#[doc = "      \"propertyNames\": {"]
#[doc = "        \"description\": \"An identifier for a Node which is unique within a Graph.\""]
#[doc = "      }"]
#[doc = "    }"]
#[doc = "  }"]
#[doc = "}"]
#[doc = r" ```"]
#[doc = r" </details>"]
#[derive(:: serde :: Deserialize, :: serde :: Serialize, Clone, Debug)]
pub struct Graph {
    #[serde(default = "defaults::graph_nodekit_version")]
    pub nodekit_version: ::std::string::String,
    pub nodes: ::std::collections::HashMap<::std::string::String, Node>,
    #[doc = "An identifier for a Node which is unique within a Graph."]
    pub start: ::std::string::String,
    #[doc = "A mapping from (NodeId, SensorId) to the next Node that will be transitioned if the Sensor is triggered in that Node."]
    pub transitions: ::std::collections::HashMap<
        ::std::string::String,
        ::std::collections::HashMap<::std::string::String, ::std::string::String>,
    >,
}
impl ::std::convert::From<&Graph> for Graph {
    fn from(value: &Graph) -> Self {
        value.clone()
    }
}
impl Graph {
    pub fn builder() -> builder::Graph {
        Default::default()
    }
}
#[doc = "Effect to hide the pointer during a timespan."]
#[doc = r""]
#[doc = r" <details><summary>JSON schema</summary>"]
#[doc = r""]
#[doc = r" ```json"]
#[doc = "{"]
#[doc = "  \"title\": \"HidePointerEffect\","]
#[doc = "  \"description\": \"Effect to hide the pointer during a timespan.\","]
#[doc = "  \"type\": \"object\","]
#[doc = "  \"required\": ["]
#[doc = "    \"end_msec\""]
#[doc = "  ],"]
#[doc = "  \"properties\": {"]
#[doc = "    \"effect_type\": {"]
#[doc = "      \"title\": \"Effect Type\","]
#[doc = "      \"default\": \"HidePointerEffect\","]
#[doc = "      \"type\": \"string\","]
#[doc = "      \"const\": \"HidePointerEffect\""]
#[doc = "    },"]
#[doc = "    \"end_msec\": {"]
#[doc = "      \"title\": \"End Msec\","]
#[doc = "      \"description\": \"A point in time relative to the start of a Node.\","]
#[doc = "      \"type\": \"integer\","]
#[doc = "      \"minimum\": 0.0"]
#[doc = "    },"]
#[doc = "    \"start_msec\": {"]
#[doc = "      \"title\": \"Start Msec\","]
#[doc = "      \"description\": \"The time (in milliseconds) relative to Node start when the Effect begins.\","]
#[doc = "      \"default\": 0,"]
#[doc = "      \"type\": \"integer\","]
#[doc = "      \"minimum\": 0.0"]
#[doc = "    }"]
#[doc = "  }"]
#[doc = "}"]
#[doc = r" ```"]
#[doc = r" </details>"]
#[derive(:: serde :: Deserialize, :: serde :: Serialize, Clone, Debug)]
pub struct HidePointerEffect {
    #[serde(default = "defaults::hide_pointer_effect_effect_type")]
    pub effect_type: ::std::string::String,
    #[doc = "A point in time relative to the start of a Node."]
    pub end_msec: u64,
    #[doc = "The time (in milliseconds) relative to Node start when the Effect begins."]
    #[serde(default)]
    pub start_msec: u64,
}
impl ::std::convert::From<&HidePointerEffect> for HidePointerEffect {
    fn from(value: &HidePointerEffect) -> Self {
        value.clone()
    }
}
impl HidePointerEffect {
    pub fn builder() -> builder::HidePointerEffect {
        Default::default()
    }
}
#[doc = "`Image`"]
#[doc = r""]
#[doc = r" <details><summary>JSON schema</summary>"]
#[doc = r""]
#[doc = r" ```json"]
#[doc = "{"]
#[doc = "  \"title\": \"Image\","]
#[doc = "  \"type\": \"object\","]
#[doc = "  \"required\": ["]
#[doc = "    \"locator\","]
#[doc = "    \"media_type\","]
#[doc = "    \"sha256\""]
#[doc = "  ],"]
#[doc = "  \"properties\": {"]
#[doc = "    \"locator\": {"]
#[doc = "      \"description\": \"A location which is a claimed source of valid bytes for this Asset.\","]
#[doc = "      \"$ref\": \"#/$defs/AssetLocator\""]
#[doc = "    },"]
#[doc = "    \"media_type\": {"]
#[doc = "      \"description\": \"The IANA media (MIME) type of the image file.\","]
#[doc = "      \"$ref\": \"#/$defs/ImageMediaType\""]
#[doc = "    },"]
#[doc = "    \"sha256\": {"]
#[doc = "      \"title\": \"Sha256\","]
#[doc = "      \"description\": \"The SHA-256 hash of the asset file, as a hex string.\","]
#[doc = "      \"type\": \"string\","]
#[doc = "      \"pattern\": \"^[a-f0-9]{64}$\""]
#[doc = "    }"]
#[doc = "  }"]
#[doc = "}"]
#[doc = r" ```"]
#[doc = r" </details>"]
#[derive(:: serde :: Deserialize, :: serde :: Serialize, Clone, Debug)]
pub struct Image {
    #[doc = "A location which is a claimed source of valid bytes for this Asset."]
    pub locator: AssetLocator,
    #[doc = "The IANA media (MIME) type of the image file."]
    pub media_type: ImageMediaType,
    #[doc = "The SHA-256 hash of the asset file, as a hex string."]
    pub sha256: Sha256,
}
impl ::std::convert::From<&Image> for Image {
    fn from(value: &Image) -> Self {
        value.clone()
    }
}
impl Image {
    pub fn builder() -> builder::Image {
        Default::default()
    }
}
#[doc = "`ImageCard`"]
#[doc = r""]
#[doc = r" <details><summary>JSON schema</summary>"]
#[doc = r""]
#[doc = r" ```json"]
#[doc = "{"]
#[doc = "  \"title\": \"ImageCard\","]
#[doc = "  \"type\": \"object\","]
#[doc = "  \"required\": ["]
#[doc = "    \"h\","]
#[doc = "    \"image\","]
#[doc = "    \"w\","]
#[doc = "    \"x\","]
#[doc = "    \"y\""]
#[doc = "  ],"]
#[doc = "  \"properties\": {"]
#[doc = "    \"card_type\": {"]
#[doc = "      \"title\": \"Card Type\","]
#[doc = "      \"default\": \"ImageCard\","]
#[doc = "      \"type\": \"string\","]
#[doc = "      \"const\": \"ImageCard\""]
#[doc = "    },"]
#[doc = "    \"end_msec\": {"]
#[doc = "      \"title\": \"End Msec\","]
#[doc = "      \"description\": \"The time (in milliseconds) relative to Node start when the Card is removed from the Board.\","]
#[doc = "      \"default\": null,"]
#[doc = "      \"anyOf\": ["]
#[doc = "        {"]
#[doc = "          \"description\": \"A point in time relative to the start of a Node.\","]
#[doc = "          \"type\": \"integer\","]
#[doc = "          \"minimum\": 0.0"]
#[doc = "        },"]
#[doc = "        {"]
#[doc = "          \"type\": \"null\""]
#[doc = "        }"]
#[doc = "      ]"]
#[doc = "    },"]
#[doc = "    \"h\": {"]
#[doc = "      \"description\": \"The height of the Card, in Board units.\","]
#[doc = "      \"$ref\": \"#/$defs/nodekit___internal__types__common__SpatialSize__1\""]
#[doc = "    },"]
#[doc = "    \"image\": {"]
#[doc = "      \"$ref\": \"#/$defs/Image\""]
#[doc = "    },"]
#[doc = "    \"start_msec\": {"]
#[doc = "      \"title\": \"Start Msec\","]
#[doc = "      \"description\": \"The time (in milliseconds) relative to Node start when the Card is placed on the Board.\","]
#[doc = "      \"default\": 0,"]
#[doc = "      \"type\": \"integer\","]
#[doc = "      \"minimum\": 0.0"]
#[doc = "    },"]
#[doc = "    \"w\": {"]
#[doc = "      \"description\": \"The width of the Card, in Board units.\","]
#[doc = "      \"$ref\": \"#/$defs/nodekit___internal__types__common__SpatialSize__1\""]
#[doc = "    },"]
#[doc = "    \"x\": {"]
#[doc = "      \"description\": \"The x-coordinate of the Card center on the Board. 0 is the center of the Board. An increase in x moves right.\","]
#[doc = "      \"$ref\": \"#/$defs/SpatialPoint\""]
#[doc = "    },"]
#[doc = "    \"y\": {"]
#[doc = "      \"description\": \"The y-coordinate of the Card center on the Board. 0 is the center of the Board. An increase in y moves up.\","]
#[doc = "      \"$ref\": \"#/$defs/SpatialPoint\""]
#[doc = "    },"]
#[doc = "    \"z_index\": {"]
#[doc = "      \"title\": \"Z Index\","]
#[doc = "      \"default\": null,"]
#[doc = "      \"anyOf\": ["]
#[doc = "        {"]
#[doc = "          \"type\": \"integer\""]
#[doc = "        },"]
#[doc = "        {"]
#[doc = "          \"type\": \"null\""]
#[doc = "        }"]
#[doc = "      ]"]
#[doc = "    }"]
#[doc = "  }"]
#[doc = "}"]
#[doc = r" ```"]
#[doc = r" </details>"]
#[derive(:: serde :: Deserialize, :: serde :: Serialize, Clone, Debug)]
pub struct ImageCard {
    #[serde(default = "defaults::image_card_card_type")]
    pub card_type: ::std::string::String,
    #[doc = "The time (in milliseconds) relative to Node start when the Card is removed from the Board."]
    #[serde(default, skip_serializing_if = "::std::option::Option::is_none")]
    pub end_msec: ::std::option::Option<u64>,
    #[doc = "The height of the Card, in Board units."]
    pub h: NodekitInternalTypesCommonSpatialSize1,
    pub image: Image,
    #[doc = "The time (in milliseconds) relative to Node start when the Card is placed on the Board."]
    #[serde(default)]
    pub start_msec: u64,
    #[doc = "The width of the Card, in Board units."]
    pub w: NodekitInternalTypesCommonSpatialSize1,
    #[doc = "The x-coordinate of the Card center on the Board. 0 is the center of the Board. An increase in x moves right."]
    pub x: SpatialPoint,
    #[doc = "The y-coordinate of the Card center on the Board. 0 is the center of the Board. An increase in y moves up."]
    pub y: SpatialPoint,
    #[serde(default, skip_serializing_if = "::std::option::Option::is_none")]
    pub z_index: ::std::option::Option<i64>,
}
impl ::std::convert::From<&ImageCard> for ImageCard {
    fn from(value: &ImageCard) -> Self {
        value.clone()
    }
}
impl ImageCard {
    pub fn builder() -> builder::ImageCard {
        Default::default()
    }
}
#[doc = "`ImageMediaType`"]
#[doc = r""]
#[doc = r" <details><summary>JSON schema</summary>"]
#[doc = r""]
#[doc = r" ```json"]
#[doc = "{"]
#[doc = "  \"type\": \"string\","]
#[doc = "  \"enum\": ["]
#[doc = "    \"image/png\","]
#[doc = "    \"image/svg+xml\""]
#[doc = "  ]"]
#[doc = "}"]
#[doc = r" ```"]
#[doc = r" </details>"]
#[derive(
    :: serde :: Deserialize,
    :: serde :: Serialize,
    Clone,
    Copy,
    Debug,
    Eq,
    Hash,
    Ord,
    PartialEq,
    PartialOrd,
)]
pub enum ImageMediaType {
    #[serde(rename = "image/png")]
    ImagePng,
    #[serde(rename = "image/svg+xml")]
    ImageSvgXml,
}
impl ::std::convert::From<&Self> for ImageMediaType {
    fn from(value: &ImageMediaType) -> Self {
        value.clone()
    }
}
impl ::std::fmt::Display for ImageMediaType {
    fn fmt(&self, f: &mut ::std::fmt::Formatter<'_>) -> ::std::fmt::Result {
        match *self {
            Self::ImagePng => f.write_str("image/png"),
            Self::ImageSvgXml => f.write_str("image/svg+xml"),
        }
    }
}
impl ::std::str::FromStr for ImageMediaType {
    type Err = self::error::ConversionError;
    fn from_str(value: &str) -> ::std::result::Result<Self, self::error::ConversionError> {
        match value {
            "image/png" => Ok(Self::ImagePng),
            "image/svg+xml" => Ok(Self::ImageSvgXml),
            _ => Err("invalid value".into()),
        }
    }
}
impl ::std::convert::TryFrom<&str> for ImageMediaType {
    type Error = self::error::ConversionError;
    fn try_from(value: &str) -> ::std::result::Result<Self, self::error::ConversionError> {
        value.parse()
    }
}
impl ::std::convert::TryFrom<&::std::string::String> for ImageMediaType {
    type Error = self::error::ConversionError;
    fn try_from(
        value: &::std::string::String,
    ) -> ::std::result::Result<Self, self::error::ConversionError> {
        value.parse()
    }
}
impl ::std::convert::TryFrom<::std::string::String> for ImageMediaType {
    type Error = self::error::ConversionError;
    fn try_from(
        value: ::std::string::String,
    ) -> ::std::result::Result<Self, self::error::ConversionError> {
        value.parse()
    }
}
#[doc = "`JsonValue`"]
#[doc = r""]
#[doc = r" <details><summary>JSON schema</summary>"]
#[doc = r""]
#[doc = r" ```json"]
#[doc = "{"]
#[doc = "  \"anyOf\": ["]
#[doc = "    {"]
#[doc = "      \"type\": \"string\""]
#[doc = "    },"]
#[doc = "    {"]
#[doc = "      \"type\": \"integer\""]
#[doc = "    },"]
#[doc = "    {"]
#[doc = "      \"type\": \"number\""]
#[doc = "    },"]
#[doc = "    {"]
#[doc = "      \"type\": \"boolean\""]
#[doc = "    },"]
#[doc = "    {"]
#[doc = "      \"type\": \"array\","]
#[doc = "      \"items\": {"]
#[doc = "        \"$ref\": \"#/$defs/JsonValue\""]
#[doc = "      }"]
#[doc = "    },"]
#[doc = "    {"]
#[doc = "      \"type\": \"object\","]
#[doc = "      \"additionalProperties\": {"]
#[doc = "        \"$ref\": \"#/$defs/JsonValue\""]
#[doc = "      }"]
#[doc = "    },"]
#[doc = "    {"]
#[doc = "      \"type\": \"null\""]
#[doc = "    }"]
#[doc = "  ]"]
#[doc = "}"]
#[doc = r" ```"]
#[doc = r" </details>"]
#[derive(:: serde :: Deserialize, :: serde :: Serialize, Clone, Debug)]
#[serde(untagged)]
pub enum JsonValue {
    String(::std::string::String),
    Integer(i64),
    Number(f64),
    Boolean(bool),
    Array(::std::vec::Vec<JsonValue>),
    Object(::std::collections::HashMap<::std::string::String, JsonValue>),
    Null,
}
impl ::std::convert::From<&Self> for JsonValue {
    fn from(value: &JsonValue) -> Self {
        value.clone()
    }
}
impl ::std::convert::From<i64> for JsonValue {
    fn from(value: i64) -> Self {
        Self::Integer(value)
    }
}
impl ::std::convert::From<f64> for JsonValue {
    fn from(value: f64) -> Self {
        Self::Number(value)
    }
}
impl ::std::convert::From<bool> for JsonValue {
    fn from(value: bool) -> Self {
        Self::Boolean(value)
    }
}
impl ::std::convert::From<::std::vec::Vec<JsonValue>> for JsonValue {
    fn from(value: ::std::vec::Vec<JsonValue>) -> Self {
        Self::Array(value)
    }
}
impl ::std::convert::From<::std::collections::HashMap<::std::string::String, JsonValue>>
    for JsonValue
{
    fn from(value: ::std::collections::HashMap<::std::string::String, JsonValue>) -> Self {
        Self::Object(value)
    }
}
#[doc = "`JustificationHorizontal`"]
#[doc = r""]
#[doc = r" <details><summary>JSON schema</summary>"]
#[doc = r""]
#[doc = r" ```json"]
#[doc = "{"]
#[doc = "  \"title\": \"Justification Horizontal\","]
#[doc = "  \"default\": \"center\","]
#[doc = "  \"type\": \"string\","]
#[doc = "  \"enum\": ["]
#[doc = "    \"left\","]
#[doc = "    \"center\","]
#[doc = "    \"right\""]
#[doc = "  ]"]
#[doc = "}"]
#[doc = r" ```"]
#[doc = r" </details>"]
#[derive(
    :: serde :: Deserialize,
    :: serde :: Serialize,
    Clone,
    Copy,
    Debug,
    Eq,
    Hash,
    Ord,
    PartialEq,
    PartialOrd,
)]
pub enum JustificationHorizontal {
    #[serde(rename = "left")]
    Left,
    #[serde(rename = "center")]
    Center,
    #[serde(rename = "right")]
    Right,
}
impl ::std::convert::From<&Self> for JustificationHorizontal {
    fn from(value: &JustificationHorizontal) -> Self {
        value.clone()
    }
}
impl ::std::fmt::Display for JustificationHorizontal {
    fn fmt(&self, f: &mut ::std::fmt::Formatter<'_>) -> ::std::fmt::Result {
        match *self {
            Self::Left => f.write_str("left"),
            Self::Center => f.write_str("center"),
            Self::Right => f.write_str("right"),
        }
    }
}
impl ::std::str::FromStr for JustificationHorizontal {
    type Err = self::error::ConversionError;
    fn from_str(value: &str) -> ::std::result::Result<Self, self::error::ConversionError> {
        match value {
            "left" => Ok(Self::Left),
            "center" => Ok(Self::Center),
            "right" => Ok(Self::Right),
            _ => Err("invalid value".into()),
        }
    }
}
impl ::std::convert::TryFrom<&str> for JustificationHorizontal {
    type Error = self::error::ConversionError;
    fn try_from(value: &str) -> ::std::result::Result<Self, self::error::ConversionError> {
        value.parse()
    }
}
impl ::std::convert::TryFrom<&::std::string::String> for JustificationHorizontal {
    type Error = self::error::ConversionError;
    fn try_from(
        value: &::std::string::String,
    ) -> ::std::result::Result<Self, self::error::ConversionError> {
        value.parse()
    }
}
impl ::std::convert::TryFrom<::std::string::String> for JustificationHorizontal {
    type Error = self::error::ConversionError;
    fn try_from(
        value: ::std::string::String,
    ) -> ::std::result::Result<Self, self::error::ConversionError> {
        value.parse()
    }
}
impl ::std::default::Default for JustificationHorizontal {
    fn default() -> Self {
        JustificationHorizontal::Center
    }
}
#[doc = "`JustificationVertical`"]
#[doc = r""]
#[doc = r" <details><summary>JSON schema</summary>"]
#[doc = r""]
#[doc = r" ```json"]
#[doc = "{"]
#[doc = "  \"title\": \"Justification Vertical\","]
#[doc = "  \"default\": \"center\","]
#[doc = "  \"type\": \"string\","]
#[doc = "  \"enum\": ["]
#[doc = "    \"top\","]
#[doc = "    \"center\","]
#[doc = "    \"bottom\""]
#[doc = "  ]"]
#[doc = "}"]
#[doc = r" ```"]
#[doc = r" </details>"]
#[derive(
    :: serde :: Deserialize,
    :: serde :: Serialize,
    Clone,
    Copy,
    Debug,
    Eq,
    Hash,
    Ord,
    PartialEq,
    PartialOrd,
)]
pub enum JustificationVertical {
    #[serde(rename = "top")]
    Top,
    #[serde(rename = "center")]
    Center,
    #[serde(rename = "bottom")]
    Bottom,
}
impl ::std::convert::From<&Self> for JustificationVertical {
    fn from(value: &JustificationVertical) -> Self {
        value.clone()
    }
}
impl ::std::fmt::Display for JustificationVertical {
    fn fmt(&self, f: &mut ::std::fmt::Formatter<'_>) -> ::std::fmt::Result {
        match *self {
            Self::Top => f.write_str("top"),
            Self::Center => f.write_str("center"),
            Self::Bottom => f.write_str("bottom"),
        }
    }
}
impl ::std::str::FromStr for JustificationVertical {
    type Err = self::error::ConversionError;
    fn from_str(value: &str) -> ::std::result::Result<Self, self::error::ConversionError> {
        match value {
            "top" => Ok(Self::Top),
            "center" => Ok(Self::Center),
            "bottom" => Ok(Self::Bottom),
            _ => Err("invalid value".into()),
        }
    }
}
impl ::std::convert::TryFrom<&str> for JustificationVertical {
    type Error = self::error::ConversionError;
    fn try_from(value: &str) -> ::std::result::Result<Self, self::error::ConversionError> {
        value.parse()
    }
}
impl ::std::convert::TryFrom<&::std::string::String> for JustificationVertical {
    type Error = self::error::ConversionError;
    fn try_from(
        value: &::std::string::String,
    ) -> ::std::result::Result<Self, self::error::ConversionError> {
        value.parse()
    }
}
impl ::std::convert::TryFrom<::std::string::String> for JustificationVertical {
    type Error = self::error::ConversionError;
    fn try_from(
        value: ::std::string::String,
    ) -> ::std::result::Result<Self, self::error::ConversionError> {
        value.parse()
    }
}
impl ::std::default::Default for JustificationVertical {
    fn default() -> Self {
        JustificationVertical::Center
    }
}
#[doc = "The key that triggers the Sensor when pressed down."]
#[doc = r""]
#[doc = r" <details><summary>JSON schema</summary>"]
#[doc = r""]
#[doc = r" ```json"]
#[doc = "{"]
#[doc = "  \"title\": \"Key\","]
#[doc = "  \"description\": \"The key that triggers the Sensor when pressed down.\","]
#[doc = "  \"type\": \"string\","]
#[doc = "  \"enum\": ["]
#[doc = "    \"Enter\","]
#[doc = "    \"space\","]
#[doc = "    \"ArrowDown\","]
#[doc = "    \"ArrowLeft\","]
#[doc = "    \"ArrowRight\","]
#[doc = "    \"ArrowUp\","]
#[doc = "    \"a\","]
#[doc = "    \"b\","]
#[doc = "    \"c\","]
#[doc = "    \"d\","]
#[doc = "    \"e\","]
#[doc = "    \"f\","]
#[doc = "    \"g\","]
#[doc = "    \"h\","]
#[doc = "    \"i\","]
#[doc = "    \"j\","]
#[doc = "    \"k\","]
#[doc = "    \"l\","]
#[doc = "    \"m\","]
#[doc = "    \"n\","]
#[doc = "    \"o\","]
#[doc = "    \"p\","]
#[doc = "    \"q\","]
#[doc = "    \"r\","]
#[doc = "    \"s\","]
#[doc = "    \"t\","]
#[doc = "    \"u\","]
#[doc = "    \"v\","]
#[doc = "    \"w\","]
#[doc = "    \"x\","]
#[doc = "    \"y\","]
#[doc = "    \"z\","]
#[doc = "    \"0\","]
#[doc = "    \"1\","]
#[doc = "    \"2\","]
#[doc = "    \"3\","]
#[doc = "    \"4\","]
#[doc = "    \"5\","]
#[doc = "    \"6\","]
#[doc = "    \"7\","]
#[doc = "    \"8\","]
#[doc = "    \"9\""]
#[doc = "  ]"]
#[doc = "}"]
#[doc = r" ```"]
#[doc = r" </details>"]
#[derive(
    :: serde :: Deserialize,
    :: serde :: Serialize,
    Clone,
    Copy,
    Debug,
    Eq,
    Hash,
    Ord,
    PartialEq,
    PartialOrd,
)]
pub enum Key {
    Enter,
    #[serde(rename = "space")]
    Space,
    ArrowDown,
    ArrowLeft,
    ArrowRight,
    ArrowUp,
    #[serde(rename = "a")]
    A,
    #[serde(rename = "b")]
    B,
    #[serde(rename = "c")]
    C,
    #[serde(rename = "d")]
    D,
    #[serde(rename = "e")]
    E,
    #[serde(rename = "f")]
    F,
    #[serde(rename = "g")]
    G,
    #[serde(rename = "h")]
    H,
    #[serde(rename = "i")]
    I,
    #[serde(rename = "j")]
    J,
    #[serde(rename = "k")]
    K,
    #[serde(rename = "l")]
    L,
    #[serde(rename = "m")]
    M,
    #[serde(rename = "n")]
    N,
    #[serde(rename = "o")]
    O,
    #[serde(rename = "p")]
    P,
    #[serde(rename = "q")]
    Q,
    #[serde(rename = "r")]
    R,
    #[serde(rename = "s")]
    S,
    #[serde(rename = "t")]
    T,
    #[serde(rename = "u")]
    U,
    #[serde(rename = "v")]
    V,
    #[serde(rename = "w")]
    W,
    #[serde(rename = "x")]
    X,
    #[serde(rename = "y")]
    Y,
    #[serde(rename = "z")]
    Z,
    #[serde(rename = "0")]
    X0,
    #[serde(rename = "1")]
    X1,
    #[serde(rename = "2")]
    X2,
    #[serde(rename = "3")]
    X3,
    #[serde(rename = "4")]
    X4,
    #[serde(rename = "5")]
    X5,
    #[serde(rename = "6")]
    X6,
    #[serde(rename = "7")]
    X7,
    #[serde(rename = "8")]
    X8,
    #[serde(rename = "9")]
    X9,
}
impl ::std::convert::From<&Self> for Key {
    fn from(value: &Key) -> Self {
        value.clone()
    }
}
impl ::std::fmt::Display for Key {
    fn fmt(&self, f: &mut ::std::fmt::Formatter<'_>) -> ::std::fmt::Result {
        match *self {
            Self::Enter => f.write_str("Enter"),
            Self::Space => f.write_str("space"),
            Self::ArrowDown => f.write_str("ArrowDown"),
            Self::ArrowLeft => f.write_str("ArrowLeft"),
            Self::ArrowRight => f.write_str("ArrowRight"),
            Self::ArrowUp => f.write_str("ArrowUp"),
            Self::A => f.write_str("a"),
            Self::B => f.write_str("b"),
            Self::C => f.write_str("c"),
            Self::D => f.write_str("d"),
            Self::E => f.write_str("e"),
            Self::F => f.write_str("f"),
            Self::G => f.write_str("g"),
            Self::H => f.write_str("h"),
            Self::I => f.write_str("i"),
            Self::J => f.write_str("j"),
            Self::K => f.write_str("k"),
            Self::L => f.write_str("l"),
            Self::M => f.write_str("m"),
            Self::N => f.write_str("n"),
            Self::O => f.write_str("o"),
            Self::P => f.write_str("p"),
            Self::Q => f.write_str("q"),
            Self::R => f.write_str("r"),
            Self::S => f.write_str("s"),
            Self::T => f.write_str("t"),
            Self::U => f.write_str("u"),
            Self::V => f.write_str("v"),
            Self::W => f.write_str("w"),
            Self::X => f.write_str("x"),
            Self::Y => f.write_str("y"),
            Self::Z => f.write_str("z"),
            Self::X0 => f.write_str("0"),
            Self::X1 => f.write_str("1"),
            Self::X2 => f.write_str("2"),
            Self::X3 => f.write_str("3"),
            Self::X4 => f.write_str("4"),
            Self::X5 => f.write_str("5"),
            Self::X6 => f.write_str("6"),
            Self::X7 => f.write_str("7"),
            Self::X8 => f.write_str("8"),
            Self::X9 => f.write_str("9"),
        }
    }
}
impl ::std::str::FromStr for Key {
    type Err = self::error::ConversionError;
    fn from_str(value: &str) -> ::std::result::Result<Self, self::error::ConversionError> {
        match value {
            "Enter" => Ok(Self::Enter),
            "space" => Ok(Self::Space),
            "ArrowDown" => Ok(Self::ArrowDown),
            "ArrowLeft" => Ok(Self::ArrowLeft),
            "ArrowRight" => Ok(Self::ArrowRight),
            "ArrowUp" => Ok(Self::ArrowUp),
            "a" => Ok(Self::A),
            "b" => Ok(Self::B),
            "c" => Ok(Self::C),
            "d" => Ok(Self::D),
            "e" => Ok(Self::E),
            "f" => Ok(Self::F),
            "g" => Ok(Self::G),
            "h" => Ok(Self::H),
            "i" => Ok(Self::I),
            "j" => Ok(Self::J),
            "k" => Ok(Self::K),
            "l" => Ok(Self::L),
            "m" => Ok(Self::M),
            "n" => Ok(Self::N),
            "o" => Ok(Self::O),
            "p" => Ok(Self::P),
            "q" => Ok(Self::Q),
            "r" => Ok(Self::R),
            "s" => Ok(Self::S),
            "t" => Ok(Self::T),
            "u" => Ok(Self::U),
            "v" => Ok(Self::V),
            "w" => Ok(Self::W),
            "x" => Ok(Self::X),
            "y" => Ok(Self::Y),
            "z" => Ok(Self::Z),
            "0" => Ok(Self::X0),
            "1" => Ok(Self::X1),
            "2" => Ok(Self::X2),
            "3" => Ok(Self::X3),
            "4" => Ok(Self::X4),
            "5" => Ok(Self::X5),
            "6" => Ok(Self::X6),
            "7" => Ok(Self::X7),
            "8" => Ok(Self::X8),
            "9" => Ok(Self::X9),
            _ => Err("invalid value".into()),
        }
    }
}
impl ::std::convert::TryFrom<&str> for Key {
    type Error = self::error::ConversionError;
    fn try_from(value: &str) -> ::std::result::Result<Self, self::error::ConversionError> {
        value.parse()
    }
}
impl ::std::convert::TryFrom<&::std::string::String> for Key {
    type Error = self::error::ConversionError;
    fn try_from(
        value: &::std::string::String,
    ) -> ::std::result::Result<Self, self::error::ConversionError> {
        value.parse()
    }
}
impl ::std::convert::TryFrom<::std::string::String> for Key {
    type Error = self::error::ConversionError;
    fn try_from(
        value: ::std::string::String,
    ) -> ::std::result::Result<Self, self::error::ConversionError> {
        value.parse()
    }
}
#[doc = "`KeySensor`"]
#[doc = r""]
#[doc = r" <details><summary>JSON schema</summary>"]
#[doc = r""]
#[doc = r" ```json"]
#[doc = "{"]
#[doc = "  \"title\": \"KeySensor\","]
#[doc = "  \"type\": \"object\","]
#[doc = "  \"required\": ["]
#[doc = "    \"key\""]
#[doc = "  ],"]
#[doc = "  \"properties\": {"]
#[doc = "    \"end_msec\": {"]
#[doc = "      \"title\": \"End Msec\","]
#[doc = "      \"description\": \"The time (in milliseconds) relative to Node start when the Sensor is disarmed. If None, the Sensor remains armed until the Node ends.\","]
#[doc = "      \"default\": null,"]
#[doc = "      \"anyOf\": ["]
#[doc = "        {"]
#[doc = "          \"description\": \"A point in time relative to the start of a Node.\","]
#[doc = "          \"type\": \"integer\","]
#[doc = "          \"minimum\": 0.0"]
#[doc = "        },"]
#[doc = "        {"]
#[doc = "          \"type\": \"null\""]
#[doc = "        }"]
#[doc = "      ]"]
#[doc = "    },"]
#[doc = "    \"key\": {"]
#[doc = "      \"title\": \"Key\","]
#[doc = "      \"description\": \"The key that triggers the Sensor when pressed down.\","]
#[doc = "      \"type\": \"string\","]
#[doc = "      \"enum\": ["]
#[doc = "        \"Enter\","]
#[doc = "        \"space\","]
#[doc = "        \"ArrowDown\","]
#[doc = "        \"ArrowLeft\","]
#[doc = "        \"ArrowRight\","]
#[doc = "        \"ArrowUp\","]
#[doc = "        \"a\","]
#[doc = "        \"b\","]
#[doc = "        \"c\","]
#[doc = "        \"d\","]
#[doc = "        \"e\","]
#[doc = "        \"f\","]
#[doc = "        \"g\","]
#[doc = "        \"h\","]
#[doc = "        \"i\","]
#[doc = "        \"j\","]
#[doc = "        \"k\","]
#[doc = "        \"l\","]
#[doc = "        \"m\","]
#[doc = "        \"n\","]
#[doc = "        \"o\","]
#[doc = "        \"p\","]
#[doc = "        \"q\","]
#[doc = "        \"r\","]
#[doc = "        \"s\","]
#[doc = "        \"t\","]
#[doc = "        \"u\","]
#[doc = "        \"v\","]
#[doc = "        \"w\","]
#[doc = "        \"x\","]
#[doc = "        \"y\","]
#[doc = "        \"z\","]
#[doc = "        \"0\","]
#[doc = "        \"1\","]
#[doc = "        \"2\","]
#[doc = "        \"3\","]
#[doc = "        \"4\","]
#[doc = "        \"5\","]
#[doc = "        \"6\","]
#[doc = "        \"7\","]
#[doc = "        \"8\","]
#[doc = "        \"9\""]
#[doc = "      ]"]
#[doc = "    },"]
#[doc = "    \"sensor_type\": {"]
#[doc = "      \"title\": \"Sensor Type\","]
#[doc = "      \"default\": \"KeySensor\","]
#[doc = "      \"type\": \"string\","]
#[doc = "      \"const\": \"KeySensor\""]
#[doc = "    },"]
#[doc = "    \"start_msec\": {"]
#[doc = "      \"title\": \"Start Msec\","]
#[doc = "      \"description\": \"The time (in milliseconds) relative to Node start when the Sensor is armed.\","]
#[doc = "      \"default\": 0,"]
#[doc = "      \"type\": \"integer\","]
#[doc = "      \"minimum\": 0.0"]
#[doc = "    }"]
#[doc = "  }"]
#[doc = "}"]
#[doc = r" ```"]
#[doc = r" </details>"]
#[derive(:: serde :: Deserialize, :: serde :: Serialize, Clone, Debug)]
pub struct KeySensor {
    #[doc = "The time (in milliseconds) relative to Node start when the Sensor is disarmed. If None, the Sensor remains armed until the Node ends."]
    #[serde(default, skip_serializing_if = "::std::option::Option::is_none")]
    pub end_msec: ::std::option::Option<u64>,
    #[doc = "The key that triggers the Sensor when pressed down."]
    pub key: Key,
    #[serde(default = "defaults::key_sensor_sensor_type")]
    pub sensor_type: ::std::string::String,
    #[doc = "The time (in milliseconds) relative to Node start when the Sensor is armed."]
    #[serde(default)]
    pub start_msec: u64,
}
impl ::std::convert::From<&KeySensor> for KeySensor {
    fn from(value: &KeySensor) -> Self {
        value.clone()
    }
}
impl KeySensor {
    pub fn builder() -> builder::KeySensor {
        Default::default()
    }
}
#[doc = "The shape of the clickable region. \"rectangle\" uses the box itself; \"ellipse\" inscribes an ellipse within the box."]
#[doc = r""]
#[doc = r" <details><summary>JSON schema</summary>"]
#[doc = r""]
#[doc = r" ```json"]
#[doc = "{"]
#[doc = "  \"title\": \"Mask\","]
#[doc = "  \"description\": \"The shape of the clickable region. \\\"rectangle\\\" uses the box itself; \\\"ellipse\\\" inscribes an ellipse within the box.\","]
#[doc = "  \"default\": \"rectangle\","]
#[doc = "  \"type\": \"string\","]
#[doc = "  \"enum\": ["]
#[doc = "    \"rectangle\","]
#[doc = "    \"ellipse\""]
#[doc = "  ]"]
#[doc = "}"]
#[doc = r" ```"]
#[doc = r" </details>"]
#[derive(
    :: serde :: Deserialize,
    :: serde :: Serialize,
    Clone,
    Copy,
    Debug,
    Eq,
    Hash,
    Ord,
    PartialEq,
    PartialOrd,
)]
pub enum Mask {
    #[serde(rename = "rectangle")]
    Rectangle,
    #[serde(rename = "ellipse")]
    Ellipse,
}
impl ::std::convert::From<&Self> for Mask {
    fn from(value: &Mask) -> Self {
        value.clone()
    }
}
impl ::std::fmt::Display for Mask {
    fn fmt(&self, f: &mut ::std::fmt::Formatter<'_>) -> ::std::fmt::Result {
        match *self {
            Self::Rectangle => f.write_str("rectangle"),
            Self::Ellipse => f.write_str("ellipse"),
        }
    }
}
impl ::std::str::FromStr for Mask {
    type Err = self::error::ConversionError;
    fn from_str(value: &str) -> ::std::result::Result<Self, self::error::ConversionError> {
        match value {
            "rectangle" => Ok(Self::Rectangle),
            "ellipse" => Ok(Self::Ellipse),
            _ => Err("invalid value".into()),
        }
    }
}
impl ::std::convert::TryFrom<&str> for Mask {
    type Error = self::error::ConversionError;
    fn try_from(value: &str) -> ::std::result::Result<Self, self::error::ConversionError> {
        value.parse()
    }
}
impl ::std::convert::TryFrom<&::std::string::String> for Mask {
    type Error = self::error::ConversionError;
    fn try_from(
        value: &::std::string::String,
    ) -> ::std::result::Result<Self, self::error::ConversionError> {
        value.parse()
    }
}
impl ::std::convert::TryFrom<::std::string::String> for Mask {
    type Error = self::error::ConversionError;
    fn try_from(
        value: ::std::string::String,
    ) -> ::std::result::Result<Self, self::error::ConversionError> {
        value.parse()
    }
}
impl ::std::default::Default for Mask {
    fn default() -> Self {
        Mask::Rectangle
    }
}
#[doc = "`Node`"]
#[doc = r""]
#[doc = r" <details><summary>JSON schema</summary>"]
#[doc = r""]
#[doc = r" ```json"]
#[doc = "{"]
#[doc = "  \"title\": \"Node\","]
#[doc = "  \"type\": \"object\","]
#[doc = "  \"required\": ["]
#[doc = "    \"cards\","]
#[doc = "    \"sensors\""]
#[doc = "  ],"]
#[doc = "  \"properties\": {"]
#[doc = "    \"annotation\": {"]
#[doc = "      \"description\": \"An optional, author-supplied annotation for this Node. May be used for arbitrary purposes.\","]
#[doc = "      \"default\": null,"]
#[doc = "      \"$ref\": \"#/$defs/JsonValue\""]
#[doc = "    },"]
#[doc = "    \"board_color\": {"]
#[doc = "      \"title\": \"Board Color\","]
#[doc = "      \"description\": \"The color of the Board during this Node (the \\\"background color\\\").\","]
#[doc = "      \"default\": \"#808080ff\","]
#[doc = "      \"type\": \"string\","]
#[doc = "      \"maxLength\": 9,"]
#[doc = "      \"minLength\": 9,"]
#[doc = "      \"pattern\": \"^#[0-9a-f]{8}$\""]
#[doc = "    },"]
#[doc = "    \"cards\": {"]
#[doc = "      \"title\": \"Cards\","]
#[doc = "      \"description\": \"Set of Cards placed on the Board.\","]
#[doc = "      \"type\": \"object\","]
#[doc = "      \"additionalProperties\": {"]
#[doc = "        \"oneOf\": ["]
#[doc = "          {"]
#[doc = "            \"$ref\": \"#/$defs/ImageCard\""]
#[doc = "          },"]
#[doc = "          {"]
#[doc = "            \"$ref\": \"#/$defs/VideoCard\""]
#[doc = "          },"]
#[doc = "          {"]
#[doc = "            \"$ref\": \"#/$defs/TextCard\""]
#[doc = "          },"]
#[doc = "          {"]
#[doc = "            \"$ref\": \"#/$defs/SliderCard\""]
#[doc = "          },"]
#[doc = "          {"]
#[doc = "            \"$ref\": \"#/$defs/FreeTextEntryCard\""]
#[doc = "          }"]
#[doc = "        ],"]
#[doc = "        \"discriminator\": {"]
#[doc = "          \"mapping\": {"]
#[doc = "            \"FreeTextEntryCard\": \"#/$defs/FreeTextEntryCard\","]
#[doc = "            \"ImageCard\": \"#/$defs/ImageCard\","]
#[doc = "            \"SliderCard\": \"#/$defs/SliderCard\","]
#[doc = "            \"TextCard\": \"#/$defs/TextCard\","]
#[doc = "            \"VideoCard\": \"#/$defs/VideoCard\""]
#[doc = "          },"]
#[doc = "          \"propertyName\": \"card_type\""]
#[doc = "        }"]
#[doc = "      },"]
#[doc = "      \"propertyNames\": {"]
#[doc = "        \"description\": \"An identifier for a Card which is unique within a Node.\""]
#[doc = "      }"]
#[doc = "    },"]
#[doc = "    \"effects\": {"]
#[doc = "      \"title\": \"Effects\","]
#[doc = "      \"type\": \"array\","]
#[doc = "      \"items\": {"]
#[doc = "        \"$ref\": \"#/$defs/Effect\""]
#[doc = "      }"]
#[doc = "    },"]
#[doc = "    \"sensors\": {"]
#[doc = "      \"title\": \"Sensors\","]
#[doc = "      \"description\": \"Set of Sensors that listen for a Participant Action. The first Sensor that is triggered ends the Node.\","]
#[doc = "      \"type\": \"object\","]
#[doc = "      \"minProperties\": 1,"]
#[doc = "      \"additionalProperties\": {"]
#[doc = "        \"oneOf\": ["]
#[doc = "          {"]
#[doc = "            \"$ref\": \"#/$defs/TimeoutSensor\""]
#[doc = "          },"]
#[doc = "          {"]
#[doc = "            \"$ref\": \"#/$defs/ClickSensor\""]
#[doc = "          },"]
#[doc = "          {"]
#[doc = "            \"$ref\": \"#/$defs/KeySensor\""]
#[doc = "          },"]
#[doc = "          {"]
#[doc = "            \"$ref\": \"#/$defs/SubmitSensor\""]
#[doc = "          }"]
#[doc = "        ],"]
#[doc = "        \"discriminator\": {"]
#[doc = "          \"mapping\": {"]
#[doc = "            \"ClickSensor\": \"#/$defs/ClickSensor\","]
#[doc = "            \"KeySensor\": \"#/$defs/KeySensor\","]
#[doc = "            \"SubmitSensor\": \"#/$defs/SubmitSensor\","]
#[doc = "            \"TimeoutSensor\": \"#/$defs/TimeoutSensor\""]
#[doc = "          },"]
#[doc = "          \"propertyName\": \"sensor_type\""]
#[doc = "        }"]
#[doc = "      },"]
#[doc = "      \"propertyNames\": {"]
#[doc = "        \"description\": \"An identifier for a Sensor which is unique within a Node.\""]
#[doc = "      }"]
#[doc = "    }"]
#[doc = "  }"]
#[doc = "}"]
#[doc = r" ```"]
#[doc = r" </details>"]
#[derive(:: serde :: Deserialize, :: serde :: Serialize, Clone, Debug)]
pub struct Node {
    #[doc = "An optional, author-supplied annotation for this Node. May be used for arbitrary purposes."]
    #[serde(default = "defaults::node_annotation")]
    pub annotation: JsonValue,
    #[doc = "The color of the Board during this Node (the \"background color\")."]
    #[serde(default = "defaults::node_board_color")]
    pub board_color: BoardColor,
    #[doc = "Set of Cards placed on the Board."]
    pub cards: ::std::collections::HashMap<::std::string::String, NodeCardsValue>,
    #[serde(default, skip_serializing_if = "::std::vec::Vec::is_empty")]
    pub effects: ::std::vec::Vec<Effect>,
    #[doc = "Set of Sensors that listen for a Participant Action. The first Sensor that is triggered ends the Node."]
    pub sensors: ::std::collections::HashMap<::std::string::String, NodeSensorsValue>,
}
impl ::std::convert::From<&Node> for Node {
    fn from(value: &Node) -> Self {
        value.clone()
    }
}
impl Node {
    pub fn builder() -> builder::Node {
        Default::default()
    }
}
#[doc = "`NodeCardsValue`"]
#[doc = r""]
#[doc = r" <details><summary>JSON schema</summary>"]
#[doc = r""]
#[doc = r" ```json"]
#[doc = "{"]
#[doc = "  \"oneOf\": ["]
#[doc = "    {"]
#[doc = "      \"$ref\": \"#/$defs/ImageCard\""]
#[doc = "    },"]
#[doc = "    {"]
#[doc = "      \"$ref\": \"#/$defs/VideoCard\""]
#[doc = "    },"]
#[doc = "    {"]
#[doc = "      \"$ref\": \"#/$defs/TextCard\""]
#[doc = "    },"]
#[doc = "    {"]
#[doc = "      \"$ref\": \"#/$defs/SliderCard\""]
#[doc = "    },"]
#[doc = "    {"]
#[doc = "      \"$ref\": \"#/$defs/FreeTextEntryCard\""]
#[doc = "    }"]
#[doc = "  ],"]
#[doc = "  \"discriminator\": {"]
#[doc = "    \"mapping\": {"]
#[doc = "      \"FreeTextEntryCard\": \"#/$defs/FreeTextEntryCard\","]
#[doc = "      \"ImageCard\": \"#/$defs/ImageCard\","]
#[doc = "      \"SliderCard\": \"#/$defs/SliderCard\","]
#[doc = "      \"TextCard\": \"#/$defs/TextCard\","]
#[doc = "      \"VideoCard\": \"#/$defs/VideoCard\""]
#[doc = "    },"]
#[doc = "    \"propertyName\": \"card_type\""]
#[doc = "  }"]
#[doc = "}"]
#[doc = r" ```"]
#[doc = r" </details>"]
#[derive(:: serde :: Deserialize, :: serde :: Serialize, Clone, Debug)]
#[serde(untagged)]
pub enum NodeCardsValue {
    ImageCard(ImageCard),
    VideoCard(VideoCard),
    TextCard(TextCard),
    SliderCard(SliderCard),
    FreeTextEntryCard(FreeTextEntryCard),
}
impl ::std::convert::From<&Self> for NodeCardsValue {
    fn from(value: &NodeCardsValue) -> Self {
        value.clone()
    }
}
impl ::std::convert::From<ImageCard> for NodeCardsValue {
    fn from(value: ImageCard) -> Self {
        Self::ImageCard(value)
    }
}
impl ::std::convert::From<VideoCard> for NodeCardsValue {
    fn from(value: VideoCard) -> Self {
        Self::VideoCard(value)
    }
}
impl ::std::convert::From<TextCard> for NodeCardsValue {
    fn from(value: TextCard) -> Self {
        Self::TextCard(value)
    }
}
impl ::std::convert::From<SliderCard> for NodeCardsValue {
    fn from(value: SliderCard) -> Self {
        Self::SliderCard(value)
    }
}
impl ::std::convert::From<FreeTextEntryCard> for NodeCardsValue {
    fn from(value: FreeTextEntryCard) -> Self {
        Self::FreeTextEntryCard(value)
    }
}
#[doc = "`NodeSensorsValue`"]
#[doc = r""]
#[doc = r" <details><summary>JSON schema</summary>"]
#[doc = r""]
#[doc = r" ```json"]
#[doc = "{"]
#[doc = "  \"oneOf\": ["]
#[doc = "    {"]
#[doc = "      \"$ref\": \"#/$defs/TimeoutSensor\""]
#[doc = "    },"]
#[doc = "    {"]
#[doc = "      \"$ref\": \"#/$defs/ClickSensor\""]
#[doc = "    },"]
#[doc = "    {"]
#[doc = "      \"$ref\": \"#/$defs/KeySensor\""]
#[doc = "    },"]
#[doc = "    {"]
#[doc = "      \"$ref\": \"#/$defs/SubmitSensor\""]
#[doc = "    }"]
#[doc = "  ],"]
#[doc = "  \"discriminator\": {"]
#[doc = "    \"mapping\": {"]
#[doc = "      \"ClickSensor\": \"#/$defs/ClickSensor\","]
#[doc = "      \"KeySensor\": \"#/$defs/KeySensor\","]
#[doc = "      \"SubmitSensor\": \"#/$defs/SubmitSensor\","]
#[doc = "      \"TimeoutSensor\": \"#/$defs/TimeoutSensor\""]
#[doc = "    },"]
#[doc = "    \"propertyName\": \"sensor_type\""]
#[doc = "  }"]
#[doc = "}"]
#[doc = r" ```"]
#[doc = r" </details>"]
#[derive(:: serde :: Deserialize, :: serde :: Serialize, Clone, Debug)]
#[serde(untagged)]
pub enum NodeSensorsValue {
    TimeoutSensor(TimeoutSensor),
    ClickSensor(ClickSensor),
    KeySensor(KeySensor),
    SubmitSensor(SubmitSensor),
}
impl ::std::convert::From<&Self> for NodeSensorsValue {
    fn from(value: &NodeSensorsValue) -> Self {
        value.clone()
    }
}
impl ::std::convert::From<TimeoutSensor> for NodeSensorsValue {
    fn from(value: TimeoutSensor) -> Self {
        Self::TimeoutSensor(value)
    }
}
impl ::std::convert::From<ClickSensor> for NodeSensorsValue {
    fn from(value: ClickSensor) -> Self {
        Self::ClickSensor(value)
    }
}
impl ::std::convert::From<KeySensor> for NodeSensorsValue {
    fn from(value: KeySensor) -> Self {
        Self::KeySensor(value)
    }
}
impl ::std::convert::From<SubmitSensor> for NodeSensorsValue {
    fn from(value: SubmitSensor) -> Self {
        Self::SubmitSensor(value)
    }
}
#[doc = "`NodekitInternalTypesCommonSpatialSize1`"]
#[doc = r""]
#[doc = r" <details><summary>JSON schema</summary>"]
#[doc = r""]
#[doc = r" ```json"]
#[doc = "{"]
#[doc = "  \"description\": \"A spatial size relative to the smaller extent of the board (width or height, whichever is smaller). For example, a value of 0.5 corresponds to half the smaller extent of the board.\","]
#[doc = "  \"type\": \"number\","]
#[doc = "  \"maximum\": 1.0,"]
#[doc = "  \"minimum\": 0.0"]
#[doc = "}"]
#[doc = r" ```"]
#[doc = r" </details>"]
#[derive(:: serde :: Deserialize, :: serde :: Serialize, Clone, Debug)]
#[serde(transparent)]
pub struct NodekitInternalTypesCommonSpatialSize1(pub f64);
impl ::std::ops::Deref for NodekitInternalTypesCommonSpatialSize1 {
    type Target = f64;
    fn deref(&self) -> &f64 {
        &self.0
    }
}
impl ::std::convert::From<NodekitInternalTypesCommonSpatialSize1> for f64 {
    fn from(value: NodekitInternalTypesCommonSpatialSize1) -> Self {
        value.0
    }
}
impl ::std::convert::From<&NodekitInternalTypesCommonSpatialSize1>
    for NodekitInternalTypesCommonSpatialSize1
{
    fn from(value: &NodekitInternalTypesCommonSpatialSize1) -> Self {
        value.clone()
    }
}
impl ::std::convert::From<f64> for NodekitInternalTypesCommonSpatialSize1 {
    fn from(value: f64) -> Self {
        Self(value)
    }
}
impl ::std::str::FromStr for NodekitInternalTypesCommonSpatialSize1 {
    type Err = <f64 as ::std::str::FromStr>::Err;
    fn from_str(value: &str) -> ::std::result::Result<Self, Self::Err> {
        Ok(Self(value.parse()?))
    }
}
impl ::std::convert::TryFrom<&str> for NodekitInternalTypesCommonSpatialSize1 {
    type Error = <f64 as ::std::str::FromStr>::Err;
    fn try_from(value: &str) -> ::std::result::Result<Self, Self::Error> {
        value.parse()
    }
}
impl ::std::convert::TryFrom<&String> for NodekitInternalTypesCommonSpatialSize1 {
    type Error = <f64 as ::std::str::FromStr>::Err;
    fn try_from(value: &String) -> ::std::result::Result<Self, Self::Error> {
        value.parse()
    }
}
impl ::std::convert::TryFrom<String> for NodekitInternalTypesCommonSpatialSize1 {
    type Error = <f64 as ::std::str::FromStr>::Err;
    fn try_from(value: String) -> ::std::result::Result<Self, Self::Error> {
        value.parse()
    }
}
impl ::std::fmt::Display for NodekitInternalTypesCommonSpatialSize1 {
    fn fmt(&self, f: &mut ::std::fmt::Formatter<'_>) -> ::std::fmt::Result {
        self.0.fmt(f)
    }
}
#[doc = "`NodekitInternalTypesCommonSpatialSize2`"]
#[doc = r""]
#[doc = r" <details><summary>JSON schema</summary>"]
#[doc = r""]
#[doc = r" ```json"]
#[doc = "{"]
#[doc = "  \"description\": \"A spatial size relative to the smaller extent of the board (width or height, whichever is smaller). For example, a value of 0.5 corresponds to half the smaller extent of the board.\","]
#[doc = "  \"type\": \"number\","]
#[doc = "  \"maximum\": 1.0,"]
#[doc = "  \"minimum\": 0.0,"]
#[doc = "  \"exclusiveMinimum\": 0.0"]
#[doc = "}"]
#[doc = r" ```"]
#[doc = r" </details>"]
#[derive(:: serde :: Deserialize, :: serde :: Serialize, Clone, Debug)]
#[serde(transparent)]
pub struct NodekitInternalTypesCommonSpatialSize2(pub f64);
impl ::std::ops::Deref for NodekitInternalTypesCommonSpatialSize2 {
    type Target = f64;
    fn deref(&self) -> &f64 {
        &self.0
    }
}
impl ::std::convert::From<NodekitInternalTypesCommonSpatialSize2> for f64 {
    fn from(value: NodekitInternalTypesCommonSpatialSize2) -> Self {
        value.0
    }
}
impl ::std::convert::From<&NodekitInternalTypesCommonSpatialSize2>
    for NodekitInternalTypesCommonSpatialSize2
{
    fn from(value: &NodekitInternalTypesCommonSpatialSize2) -> Self {
        value.clone()
    }
}
impl ::std::convert::From<f64> for NodekitInternalTypesCommonSpatialSize2 {
    fn from(value: f64) -> Self {
        Self(value)
    }
}
impl ::std::str::FromStr for NodekitInternalTypesCommonSpatialSize2 {
    type Err = <f64 as ::std::str::FromStr>::Err;
    fn from_str(value: &str) -> ::std::result::Result<Self, Self::Err> {
        Ok(Self(value.parse()?))
    }
}
impl ::std::convert::TryFrom<&str> for NodekitInternalTypesCommonSpatialSize2 {
    type Error = <f64 as ::std::str::FromStr>::Err;
    fn try_from(value: &str) -> ::std::result::Result<Self, Self::Error> {
        value.parse()
    }
}
impl ::std::convert::TryFrom<&String> for NodekitInternalTypesCommonSpatialSize2 {
    type Error = <f64 as ::std::str::FromStr>::Err;
    fn try_from(value: &String) -> ::std::result::Result<Self, Self::Error> {
        value.parse()
    }
}
impl ::std::convert::TryFrom<String> for NodekitInternalTypesCommonSpatialSize2 {
    type Error = <f64 as ::std::str::FromStr>::Err;
    fn try_from(value: String) -> ::std::result::Result<Self, Self::Error> {
        value.parse()
    }
}
impl ::std::fmt::Display for NodekitInternalTypesCommonSpatialSize2 {
    fn fmt(&self, f: &mut ::std::fmt::Formatter<'_>) -> ::std::fmt::Result {
        self.0.fmt(f)
    }
}
#[doc = "The orientation of the slider. In the horizontal orientation, the slider positional index grows left to right. In the vertical orientation, the slider positional index grows bottom to top."]
#[doc = r""]
#[doc = r" <details><summary>JSON schema</summary>"]
#[doc = r""]
#[doc = r" ```json"]
#[doc = "{"]
#[doc = "  \"title\": \"Orientation\","]
#[doc = "  \"description\": \"The orientation of the slider. In the horizontal orientation, the slider positional index grows left to right. In the vertical orientation, the slider positional index grows bottom to top.\","]
#[doc = "  \"default\": \"horizontal\","]
#[doc = "  \"type\": \"string\","]
#[doc = "  \"enum\": ["]
#[doc = "    \"horizontal\","]
#[doc = "    \"vertical\""]
#[doc = "  ]"]
#[doc = "}"]
#[doc = r" ```"]
#[doc = r" </details>"]
#[derive(
    :: serde :: Deserialize,
    :: serde :: Serialize,
    Clone,
    Copy,
    Debug,
    Eq,
    Hash,
    Ord,
    PartialEq,
    PartialOrd,
)]
pub enum Orientation {
    #[serde(rename = "horizontal")]
    Horizontal,
    #[serde(rename = "vertical")]
    Vertical,
}
impl ::std::convert::From<&Self> for Orientation {
    fn from(value: &Orientation) -> Self {
        value.clone()
    }
}
impl ::std::fmt::Display for Orientation {
    fn fmt(&self, f: &mut ::std::fmt::Formatter<'_>) -> ::std::fmt::Result {
        match *self {
            Self::Horizontal => f.write_str("horizontal"),
            Self::Vertical => f.write_str("vertical"),
        }
    }
}
impl ::std::str::FromStr for Orientation {
    type Err = self::error::ConversionError;
    fn from_str(value: &str) -> ::std::result::Result<Self, self::error::ConversionError> {
        match value {
            "horizontal" => Ok(Self::Horizontal),
            "vertical" => Ok(Self::Vertical),
            _ => Err("invalid value".into()),
        }
    }
}
impl ::std::convert::TryFrom<&str> for Orientation {
    type Error = self::error::ConversionError;
    fn try_from(value: &str) -> ::std::result::Result<Self, self::error::ConversionError> {
        value.parse()
    }
}
impl ::std::convert::TryFrom<&::std::string::String> for Orientation {
    type Error = self::error::ConversionError;
    fn try_from(
        value: &::std::string::String,
    ) -> ::std::result::Result<Self, self::error::ConversionError> {
        value.parse()
    }
}
impl ::std::convert::TryFrom<::std::string::String> for Orientation {
    type Error = self::error::ConversionError;
    fn try_from(
        value: ::std::string::String,
    ) -> ::std::result::Result<Self, self::error::ConversionError> {
        value.parse()
    }
}
impl ::std::default::Default for Orientation {
    fn default() -> Self {
        Orientation::Horizontal
    }
}
#[doc = "A locator which points to a relative path on the viewer's local file system.\nThis is useful for assets that are bundled alongside a graph file, e.g., in a zip archive.\nThe viewer must resolve the relative path against a known base path."]
#[doc = r""]
#[doc = r" <details><summary>JSON schema</summary>"]
#[doc = r""]
#[doc = r" ```json"]
#[doc = "{"]
#[doc = "  \"title\": \"RelativePath\","]
#[doc = "  \"description\": \"A locator which points to a relative path on the viewer's local file system.\\nThis is useful for assets that are bundled alongside a graph file, e.g., in a zip archive.\\nThe viewer must resolve the relative path against a known base path.\","]
#[doc = "  \"type\": \"object\","]
#[doc = "  \"required\": ["]
#[doc = "    \"relative_path\""]
#[doc = "  ],"]
#[doc = "  \"properties\": {"]
#[doc = "    \"locator_type\": {"]
#[doc = "      \"title\": \"Locator Type\","]
#[doc = "      \"default\": \"RelativePath\","]
#[doc = "      \"type\": \"string\","]
#[doc = "      \"const\": \"RelativePath\""]
#[doc = "    },"]
#[doc = "    \"relative_path\": {"]
#[doc = "      \"title\": \"Relative Path\","]
#[doc = "      \"description\": \"The relative path to the asset file in the local filesystem.\","]
#[doc = "      \"type\": \"string\","]
#[doc = "      \"format\": \"path\""]
#[doc = "    }"]
#[doc = "  }"]
#[doc = "}"]
#[doc = r" ```"]
#[doc = r" </details>"]
#[derive(:: serde :: Deserialize, :: serde :: Serialize, Clone, Debug)]
pub struct RelativePath {
    #[serde(default = "defaults::relative_path_locator_type")]
    pub locator_type: ::std::string::String,
    #[doc = "The relative path to the asset file in the local filesystem."]
    pub relative_path: ::std::string::String,
}
impl ::std::convert::From<&RelativePath> for RelativePath {
    fn from(value: &RelativePath) -> Self {
        value.clone()
    }
}
impl RelativePath {
    pub fn builder() -> builder::RelativePath {
        Default::default()
    }
}
#[doc = "The SHA-256 hash of the asset file, as a hex string."]
#[doc = r""]
#[doc = r" <details><summary>JSON schema</summary>"]
#[doc = r""]
#[doc = r" ```json"]
#[doc = "{"]
#[doc = "  \"title\": \"Sha256\","]
#[doc = "  \"description\": \"The SHA-256 hash of the asset file, as a hex string.\","]
#[doc = "  \"type\": \"string\","]
#[doc = "  \"pattern\": \"^[a-f0-9]{64}$\""]
#[doc = "}"]
#[doc = r" ```"]
#[doc = r" </details>"]
#[derive(:: serde :: Serialize, Clone, Debug, Eq, Hash, Ord, PartialEq, PartialOrd)]
#[serde(transparent)]
pub struct Sha256(::std::string::String);
impl ::std::ops::Deref for Sha256 {
    type Target = ::std::string::String;
    fn deref(&self) -> &::std::string::String {
        &self.0
    }
}
impl ::std::convert::From<Sha256> for ::std::string::String {
    fn from(value: Sha256) -> Self {
        value.0
    }
}
impl ::std::convert::From<&Sha256> for Sha256 {
    fn from(value: &Sha256) -> Self {
        value.clone()
    }
}
impl ::std::str::FromStr for Sha256 {
    type Err = self::error::ConversionError;
    fn from_str(value: &str) -> ::std::result::Result<Self, self::error::ConversionError> {
        static PATTERN: ::std::sync::LazyLock<::regress::Regex> =
            ::std::sync::LazyLock::new(|| ::regress::Regex::new("^[a-f0-9]{64}$").unwrap());
        if PATTERN.find(value).is_none() {
            return Err("doesn't match pattern \"^[a-f0-9]{64}$\"".into());
        }
        Ok(Self(value.to_string()))
    }
}
impl ::std::convert::TryFrom<&str> for Sha256 {
    type Error = self::error::ConversionError;
    fn try_from(value: &str) -> ::std::result::Result<Self, self::error::ConversionError> {
        value.parse()
    }
}
impl ::std::convert::TryFrom<&::std::string::String> for Sha256 {
    type Error = self::error::ConversionError;
    fn try_from(
        value: &::std::string::String,
    ) -> ::std::result::Result<Self, self::error::ConversionError> {
        value.parse()
    }
}
impl ::std::convert::TryFrom<::std::string::String> for Sha256 {
    type Error = self::error::ConversionError;
    fn try_from(
        value: ::std::string::String,
    ) -> ::std::result::Result<Self, self::error::ConversionError> {
        value.parse()
    }
}
impl<'de> ::serde::Deserialize<'de> for Sha256 {
    fn deserialize<D>(deserializer: D) -> ::std::result::Result<Self, D::Error>
    where
        D: ::serde::Deserializer<'de>,
    {
        ::std::string::String::deserialize(deserializer)?
            .parse()
            .map_err(|e: self::error::ConversionError| {
                <D::Error as ::serde::de::Error>::custom(e.to_string())
            })
    }
}
#[doc = "`SliderCard`"]
#[doc = r""]
#[doc = r" <details><summary>JSON schema</summary>"]
#[doc = r""]
#[doc = r" ```json"]
#[doc = "{"]
#[doc = "  \"title\": \"SliderCard\","]
#[doc = "  \"type\": \"object\","]
#[doc = "  \"required\": ["]
#[doc = "    \"h\","]
#[doc = "    \"w\","]
#[doc = "    \"x\","]
#[doc = "    \"y\""]
#[doc = "  ],"]
#[doc = "  \"properties\": {"]
#[doc = "    \"card_type\": {"]
#[doc = "      \"title\": \"Card Type\","]
#[doc = "      \"default\": \"SliderCard\","]
#[doc = "      \"type\": \"string\","]
#[doc = "      \"const\": \"SliderCard\""]
#[doc = "    },"]
#[doc = "    \"end_msec\": {"]
#[doc = "      \"title\": \"End Msec\","]
#[doc = "      \"description\": \"The time (in milliseconds) relative to Node start when the Card is removed from the Board.\","]
#[doc = "      \"default\": null,"]
#[doc = "      \"anyOf\": ["]
#[doc = "        {"]
#[doc = "          \"description\": \"A point in time relative to the start of a Node.\","]
#[doc = "          \"type\": \"integer\","]
#[doc = "          \"minimum\": 0.0"]
#[doc = "        },"]
#[doc = "        {"]
#[doc = "          \"type\": \"null\""]
#[doc = "        }"]
#[doc = "      ]"]
#[doc = "    },"]
#[doc = "    \"h\": {"]
#[doc = "      \"description\": \"The height of the Card, in Board units.\","]
#[doc = "      \"$ref\": \"#/$defs/nodekit___internal__types__common__SpatialSize__1\""]
#[doc = "    },"]
#[doc = "    \"initial_bin_index\": {"]
#[doc = "      \"title\": \"Initial Bin Index\","]
#[doc = "      \"description\": \"The initial bin index that the slider is set to when it first appears. If None, defaults to the middle bin.\","]
#[doc = "      \"default\": null,"]
#[doc = "      \"anyOf\": ["]
#[doc = "        {"]
#[doc = "          \"type\": \"integer\","]
#[doc = "          \"minimum\": 0.0"]
#[doc = "        },"]
#[doc = "        {"]
#[doc = "          \"type\": \"null\""]
#[doc = "        }"]
#[doc = "      ]"]
#[doc = "    },"]
#[doc = "    \"num_bins\": {"]
#[doc = "      \"title\": \"Num Bins\","]
#[doc = "      \"description\": \"The number of discrete bins in the slider.\","]
#[doc = "      \"default\": 7,"]
#[doc = "      \"type\": \"integer\","]
#[doc = "      \"minimum\": 2.0"]
#[doc = "    },"]
#[doc = "    \"orientation\": {"]
#[doc = "      \"title\": \"Orientation\","]
#[doc = "      \"description\": \"The orientation of the slider. In the horizontal orientation, the slider positional index grows left to right. In the vertical orientation, the slider positional index grows bottom to top.\","]
#[doc = "      \"default\": \"horizontal\","]
#[doc = "      \"type\": \"string\","]
#[doc = "      \"enum\": ["]
#[doc = "        \"horizontal\","]
#[doc = "        \"vertical\""]
#[doc = "      ]"]
#[doc = "    },"]
#[doc = "    \"show_bin_markers\": {"]
#[doc = "      \"title\": \"Show Bin Markers\","]
#[doc = "      \"description\": \"Whether to show the bin markers on the slider. This is best used for sliders with a small number of bins.\","]
#[doc = "      \"default\": false,"]
#[doc = "      \"type\": \"boolean\""]
#[doc = "    },"]
#[doc = "    \"start_msec\": {"]
#[doc = "      \"title\": \"Start Msec\","]
#[doc = "      \"description\": \"The time (in milliseconds) relative to Node start when the Card is placed on the Board.\","]
#[doc = "      \"default\": 0,"]
#[doc = "      \"type\": \"integer\","]
#[doc = "      \"minimum\": 0.0"]
#[doc = "    },"]
#[doc = "    \"w\": {"]
#[doc = "      \"description\": \"The width of the Card, in Board units.\","]
#[doc = "      \"$ref\": \"#/$defs/nodekit___internal__types__common__SpatialSize__1\""]
#[doc = "    },"]
#[doc = "    \"x\": {"]
#[doc = "      \"description\": \"The x-coordinate of the Card center on the Board. 0 is the center of the Board. An increase in x moves right.\","]
#[doc = "      \"$ref\": \"#/$defs/SpatialPoint\""]
#[doc = "    },"]
#[doc = "    \"y\": {"]
#[doc = "      \"description\": \"The y-coordinate of the Card center on the Board. 0 is the center of the Board. An increase in y moves up.\","]
#[doc = "      \"$ref\": \"#/$defs/SpatialPoint\""]
#[doc = "    },"]
#[doc = "    \"z_index\": {"]
#[doc = "      \"title\": \"Z Index\","]
#[doc = "      \"default\": null,"]
#[doc = "      \"anyOf\": ["]
#[doc = "        {"]
#[doc = "          \"type\": \"integer\""]
#[doc = "        },"]
#[doc = "        {"]
#[doc = "          \"type\": \"null\""]
#[doc = "        }"]
#[doc = "      ]"]
#[doc = "    }"]
#[doc = "  }"]
#[doc = "}"]
#[doc = r" ```"]
#[doc = r" </details>"]
#[derive(:: serde :: Deserialize, :: serde :: Serialize, Clone, Debug)]
pub struct SliderCard {
    #[serde(default = "defaults::slider_card_card_type")]
    pub card_type: ::std::string::String,
    #[doc = "The time (in milliseconds) relative to Node start when the Card is removed from the Board."]
    #[serde(default, skip_serializing_if = "::std::option::Option::is_none")]
    pub end_msec: ::std::option::Option<u64>,
    #[doc = "The height of the Card, in Board units."]
    pub h: NodekitInternalTypesCommonSpatialSize1,
    #[doc = "The initial bin index that the slider is set to when it first appears. If None, defaults to the middle bin."]
    #[serde(default, skip_serializing_if = "::std::option::Option::is_none")]
    pub initial_bin_index: ::std::option::Option<u64>,
    #[doc = "The number of discrete bins in the slider."]
    #[serde(default = "defaults::default_u64::<i64, 7>")]
    pub num_bins: i64,
    #[doc = "The orientation of the slider. In the horizontal orientation, the slider positional index grows left to right. In the vertical orientation, the slider positional index grows bottom to top."]
    #[serde(default = "defaults::slider_card_orientation")]
    pub orientation: Orientation,
    #[doc = "Whether to show the bin markers on the slider. This is best used for sliders with a small number of bins."]
    #[serde(default)]
    pub show_bin_markers: bool,
    #[doc = "The time (in milliseconds) relative to Node start when the Card is placed on the Board."]
    #[serde(default)]
    pub start_msec: u64,
    #[doc = "The width of the Card, in Board units."]
    pub w: NodekitInternalTypesCommonSpatialSize1,
    #[doc = "The x-coordinate of the Card center on the Board. 0 is the center of the Board. An increase in x moves right."]
    pub x: SpatialPoint,
    #[doc = "The y-coordinate of the Card center on the Board. 0 is the center of the Board. An increase in y moves up."]
    pub y: SpatialPoint,
    #[serde(default, skip_serializing_if = "::std::option::Option::is_none")]
    pub z_index: ::std::option::Option<i64>,
}
impl ::std::convert::From<&SliderCard> for SliderCard {
    fn from(value: &SliderCard) -> Self {
        value.clone()
    }
}
impl SliderCard {
    pub fn builder() -> builder::SliderCard {
        Default::default()
    }
}
#[doc = "`SpatialPoint`"]
#[doc = r""]
#[doc = r" <details><summary>JSON schema</summary>"]
#[doc = r""]
#[doc = r" ```json"]
#[doc = "{"]
#[doc = "  \"type\": \"number\","]
#[doc = "  \"maximum\": 0.5,"]
#[doc = "  \"minimum\": -0.5"]
#[doc = "}"]
#[doc = r" ```"]
#[doc = r" </details>"]
#[derive(:: serde :: Deserialize, :: serde :: Serialize, Clone, Debug)]
#[serde(transparent)]
pub struct SpatialPoint(pub f64);
impl ::std::ops::Deref for SpatialPoint {
    type Target = f64;
    fn deref(&self) -> &f64 {
        &self.0
    }
}
impl ::std::convert::From<SpatialPoint> for f64 {
    fn from(value: SpatialPoint) -> Self {
        value.0
    }
}
impl ::std::convert::From<&SpatialPoint> for SpatialPoint {
    fn from(value: &SpatialPoint) -> Self {
        value.clone()
    }
}
impl ::std::convert::From<f64> for SpatialPoint {
    fn from(value: f64) -> Self {
        Self(value)
    }
}
impl ::std::str::FromStr for SpatialPoint {
    type Err = <f64 as ::std::str::FromStr>::Err;
    fn from_str(value: &str) -> ::std::result::Result<Self, Self::Err> {
        Ok(Self(value.parse()?))
    }
}
impl ::std::convert::TryFrom<&str> for SpatialPoint {
    type Error = <f64 as ::std::str::FromStr>::Err;
    fn try_from(value: &str) -> ::std::result::Result<Self, Self::Error> {
        value.parse()
    }
}
impl ::std::convert::TryFrom<&String> for SpatialPoint {
    type Error = <f64 as ::std::str::FromStr>::Err;
    fn try_from(value: &String) -> ::std::result::Result<Self, Self::Error> {
        value.parse()
    }
}
impl ::std::convert::TryFrom<String> for SpatialPoint {
    type Error = <f64 as ::std::str::FromStr>::Err;
    fn try_from(value: String) -> ::std::result::Result<Self, Self::Error> {
        value.parse()
    }
}
impl ::std::fmt::Display for SpatialPoint {
    fn fmt(&self, f: &mut ::std::fmt::Formatter<'_>) -> ::std::fmt::Result {
        self.0.fmt(f)
    }
}
#[doc = "A Sensor that triggers when a submit button is initiated.\nIt reports the values of one or more associated SliderCards or FreeTextEntryCards."]
#[doc = r""]
#[doc = r" <details><summary>JSON schema</summary>"]
#[doc = r""]
#[doc = r" ```json"]
#[doc = "{"]
#[doc = "  \"title\": \"SubmitSensor\","]
#[doc = "  \"description\": \"A Sensor that triggers when a submit button is initiated.\\nIt reports the values of one or more associated SliderCards or FreeTextEntryCards.\","]
#[doc = "  \"type\": \"object\","]
#[doc = "  \"required\": ["]
#[doc = "    \"source_ids\","]
#[doc = "    \"submitter_id\""]
#[doc = "  ],"]
#[doc = "  \"properties\": {"]
#[doc = "    \"end_msec\": {"]
#[doc = "      \"title\": \"End Msec\","]
#[doc = "      \"description\": \"The time (in milliseconds) relative to Node start when the Sensor is disarmed. If None, the Sensor remains armed until the Node ends.\","]
#[doc = "      \"default\": null,"]
#[doc = "      \"anyOf\": ["]
#[doc = "        {"]
#[doc = "          \"description\": \"A point in time relative to the start of a Node.\","]
#[doc = "          \"type\": \"integer\","]
#[doc = "          \"minimum\": 0.0"]
#[doc = "        },"]
#[doc = "        {"]
#[doc = "          \"type\": \"null\""]
#[doc = "        }"]
#[doc = "      ]"]
#[doc = "    },"]
#[doc = "    \"sensor_type\": {"]
#[doc = "      \"title\": \"Sensor Type\","]
#[doc = "      \"default\": \"SubmitSensor\","]
#[doc = "      \"type\": \"string\","]
#[doc = "      \"const\": \"SubmitSensor\""]
#[doc = "    },"]
#[doc = "    \"source_ids\": {"]
#[doc = "      \"title\": \"Source Ids\","]
#[doc = "      \"description\": \"The CardIds of the SliderCards or FreeTextEntryCards that this Sensor is associated with.\","]
#[doc = "      \"type\": \"array\","]
#[doc = "      \"items\": {"]
#[doc = "        \"description\": \"An identifier for a Card which is unique within a Node.\","]
#[doc = "        \"type\": \"string\""]
#[doc = "      },"]
#[doc = "      \"minItems\": 1"]
#[doc = "    },"]
#[doc = "    \"start_msec\": {"]
#[doc = "      \"title\": \"Start Msec\","]
#[doc = "      \"description\": \"The time (in milliseconds) relative to Node start when the Sensor is armed.\","]
#[doc = "      \"default\": 0,"]
#[doc = "      \"type\": \"integer\","]
#[doc = "      \"minimum\": 0.0"]
#[doc = "    },"]
#[doc = "    \"submitter_id\": {"]
#[doc = "      \"title\": \"Submitter Id\","]
#[doc = "      \"description\": \"The ID of the TextCard that submits the Slider value. If None, the Sensor triggers immediately when the Slider value changes.\","]
#[doc = "      \"type\": \"string\""]
#[doc = "    }"]
#[doc = "  }"]
#[doc = "}"]
#[doc = r" ```"]
#[doc = r" </details>"]
#[derive(:: serde :: Deserialize, :: serde :: Serialize, Clone, Debug)]
pub struct SubmitSensor {
    #[doc = "The time (in milliseconds) relative to Node start when the Sensor is disarmed. If None, the Sensor remains armed until the Node ends."]
    #[serde(default, skip_serializing_if = "::std::option::Option::is_none")]
    pub end_msec: ::std::option::Option<u64>,
    #[serde(default = "defaults::submit_sensor_sensor_type")]
    pub sensor_type: ::std::string::String,
    #[doc = "The CardIds of the SliderCards or FreeTextEntryCards that this Sensor is associated with."]
    pub source_ids: ::std::vec::Vec<::std::string::String>,
    #[doc = "The time (in milliseconds) relative to Node start when the Sensor is armed."]
    #[serde(default)]
    pub start_msec: u64,
    #[doc = "The ID of the TextCard that submits the Slider value. If None, the Sensor triggers immediately when the Slider value changes."]
    pub submitter_id: ::std::string::String,
}
impl ::std::convert::From<&SubmitSensor> for SubmitSensor {
    fn from(value: &SubmitSensor) -> Self {
        value.clone()
    }
}
impl SubmitSensor {
    pub fn builder() -> builder::SubmitSensor {
        Default::default()
    }
}
#[doc = "`TextCard`"]
#[doc = r""]
#[doc = r" <details><summary>JSON schema</summary>"]
#[doc = r""]
#[doc = r" ```json"]
#[doc = "{"]
#[doc = "  \"title\": \"TextCard\","]
#[doc = "  \"type\": \"object\","]
#[doc = "  \"required\": ["]
#[doc = "    \"h\","]
#[doc = "    \"text\","]
#[doc = "    \"w\","]
#[doc = "    \"x\","]
#[doc = "    \"y\""]
#[doc = "  ],"]
#[doc = "  \"properties\": {"]
#[doc = "    \"background_color\": {"]
#[doc = "      \"title\": \"Background Color\","]
#[doc = "      \"description\": \"The background color of the TextCard in hexadecimal format.\","]
#[doc = "      \"default\": \"#E6E6E600\","]
#[doc = "      \"type\": \"string\","]
#[doc = "      \"maxLength\": 9,"]
#[doc = "      \"minLength\": 9,"]
#[doc = "      \"pattern\": \"^#[0-9a-f]{8}$\""]
#[doc = "    },"]
#[doc = "    \"card_type\": {"]
#[doc = "      \"title\": \"Card Type\","]
#[doc = "      \"default\": \"TextCard\","]
#[doc = "      \"type\": \"string\","]
#[doc = "      \"const\": \"TextCard\""]
#[doc = "    },"]
#[doc = "    \"end_msec\": {"]
#[doc = "      \"title\": \"End Msec\","]
#[doc = "      \"description\": \"The time (in milliseconds) relative to Node start when the Card is removed from the Board.\","]
#[doc = "      \"default\": null,"]
#[doc = "      \"anyOf\": ["]
#[doc = "        {"]
#[doc = "          \"description\": \"A point in time relative to the start of a Node.\","]
#[doc = "          \"type\": \"integer\","]
#[doc = "          \"minimum\": 0.0"]
#[doc = "        },"]
#[doc = "        {"]
#[doc = "          \"type\": \"null\""]
#[doc = "        }"]
#[doc = "      ]"]
#[doc = "    },"]
#[doc = "    \"font_size\": {"]
#[doc = "      \"description\": \"The height of the em-box, in Board units.\","]
#[doc = "      \"default\": 0.02,"]
#[doc = "      \"$ref\": \"#/$defs/nodekit___internal__types__common__SpatialSize__1\""]
#[doc = "    },"]
#[doc = "    \"h\": {"]
#[doc = "      \"description\": \"The height of the Card, in Board units.\","]
#[doc = "      \"$ref\": \"#/$defs/nodekit___internal__types__common__SpatialSize__1\""]
#[doc = "    },"]
#[doc = "    \"justification_horizontal\": {"]
#[doc = "      \"title\": \"Justification Horizontal\","]
#[doc = "      \"default\": \"center\","]
#[doc = "      \"type\": \"string\","]
#[doc = "      \"enum\": ["]
#[doc = "        \"left\","]
#[doc = "        \"center\","]
#[doc = "        \"right\""]
#[doc = "      ]"]
#[doc = "    },"]
#[doc = "    \"justification_vertical\": {"]
#[doc = "      \"title\": \"Justification Vertical\","]
#[doc = "      \"default\": \"center\","]
#[doc = "      \"type\": \"string\","]
#[doc = "      \"enum\": ["]
#[doc = "        \"top\","]
#[doc = "        \"center\","]
#[doc = "        \"bottom\""]
#[doc = "      ]"]
#[doc = "    },"]
#[doc = "    \"selectable\": {"]
#[doc = "      \"title\": \"Selectable\","]
#[doc = "      \"default\": false,"]
#[doc = "      \"type\": \"boolean\""]
#[doc = "    },"]
#[doc = "    \"start_msec\": {"]
#[doc = "      \"title\": \"Start Msec\","]
#[doc = "      \"description\": \"The time (in milliseconds) relative to Node start when the Card is placed on the Board.\","]
#[doc = "      \"default\": 0,"]
#[doc = "      \"type\": \"integer\","]
#[doc = "      \"minimum\": 0.0"]
#[doc = "    },"]
#[doc = "    \"text\": {"]
#[doc = "      \"title\": \"Text\","]
#[doc = "      \"type\": \"string\""]
#[doc = "    },"]
#[doc = "    \"text_color\": {"]
#[doc = "      \"title\": \"Text Color\","]
#[doc = "      \"default\": \"#000000\","]
#[doc = "      \"type\": \"string\","]
#[doc = "      \"maxLength\": 9,"]
#[doc = "      \"minLength\": 9,"]
#[doc = "      \"pattern\": \"^#[0-9a-f]{8}$\""]
#[doc = "    },"]
#[doc = "    \"w\": {"]
#[doc = "      \"description\": \"The width of the Card, in Board units.\","]
#[doc = "      \"$ref\": \"#/$defs/nodekit___internal__types__common__SpatialSize__1\""]
#[doc = "    },"]
#[doc = "    \"x\": {"]
#[doc = "      \"description\": \"The x-coordinate of the Card center on the Board. 0 is the center of the Board. An increase in x moves right.\","]
#[doc = "      \"$ref\": \"#/$defs/SpatialPoint\""]
#[doc = "    },"]
#[doc = "    \"y\": {"]
#[doc = "      \"description\": \"The y-coordinate of the Card center on the Board. 0 is the center of the Board. An increase in y moves up.\","]
#[doc = "      \"$ref\": \"#/$defs/SpatialPoint\""]
#[doc = "    },"]
#[doc = "    \"z_index\": {"]
#[doc = "      \"title\": \"Z Index\","]
#[doc = "      \"default\": null,"]
#[doc = "      \"anyOf\": ["]
#[doc = "        {"]
#[doc = "          \"type\": \"integer\""]
#[doc = "        },"]
#[doc = "        {"]
#[doc = "          \"type\": \"null\""]
#[doc = "        }"]
#[doc = "      ]"]
#[doc = "    }"]
#[doc = "  }"]
#[doc = "}"]
#[doc = r" ```"]
#[doc = r" </details>"]
#[derive(:: serde :: Deserialize, :: serde :: Serialize, Clone, Debug)]
pub struct TextCard {
    #[doc = "The background color of the TextCard in hexadecimal format."]
    #[serde(default = "defaults::text_card_background_color")]
    pub background_color: BackgroundColor,
    #[serde(default = "defaults::text_card_card_type")]
    pub card_type: ::std::string::String,
    #[doc = "The time (in milliseconds) relative to Node start when the Card is removed from the Board."]
    #[serde(default, skip_serializing_if = "::std::option::Option::is_none")]
    pub end_msec: ::std::option::Option<u64>,
    #[doc = "The height of the em-box, in Board units."]
    #[serde(default = "defaults::text_card_font_size")]
    pub font_size: NodekitInternalTypesCommonSpatialSize1,
    #[doc = "The height of the Card, in Board units."]
    pub h: NodekitInternalTypesCommonSpatialSize1,
    #[serde(default = "defaults::text_card_justification_horizontal")]
    pub justification_horizontal: JustificationHorizontal,
    #[serde(default = "defaults::text_card_justification_vertical")]
    pub justification_vertical: JustificationVertical,
    #[serde(default)]
    pub selectable: bool,
    #[doc = "The time (in milliseconds) relative to Node start when the Card is placed on the Board."]
    #[serde(default)]
    pub start_msec: u64,
    pub text: ::std::string::String,
    #[serde(default = "defaults::text_card_text_color")]
    pub text_color: TextColor,
    #[doc = "The width of the Card, in Board units."]
    pub w: NodekitInternalTypesCommonSpatialSize1,
    #[doc = "The x-coordinate of the Card center on the Board. 0 is the center of the Board. An increase in x moves right."]
    pub x: SpatialPoint,
    #[doc = "The y-coordinate of the Card center on the Board. 0 is the center of the Board. An increase in y moves up."]
    pub y: SpatialPoint,
    #[serde(default, skip_serializing_if = "::std::option::Option::is_none")]
    pub z_index: ::std::option::Option<i64>,
}
impl ::std::convert::From<&TextCard> for TextCard {
    fn from(value: &TextCard) -> Self {
        value.clone()
    }
}
impl TextCard {
    pub fn builder() -> builder::TextCard {
        Default::default()
    }
}
#[doc = "`TextColor`"]
#[doc = r""]
#[doc = r" <details><summary>JSON schema</summary>"]
#[doc = r""]
#[doc = r" ```json"]
#[doc = "{"]
#[doc = "  \"title\": \"Text Color\","]
#[doc = "  \"default\": \"#000000\","]
#[doc = "  \"type\": \"string\","]
#[doc = "  \"maxLength\": 9,"]
#[doc = "  \"minLength\": 9,"]
#[doc = "  \"pattern\": \"^#[0-9a-f]{8}$\""]
#[doc = "}"]
#[doc = r" ```"]
#[doc = r" </details>"]
#[derive(:: serde :: Serialize, Clone, Debug, Eq, Hash, Ord, PartialEq, PartialOrd)]
#[serde(transparent)]
pub struct TextColor(::std::string::String);
impl ::std::ops::Deref for TextColor {
    type Target = ::std::string::String;
    fn deref(&self) -> &::std::string::String {
        &self.0
    }
}
impl ::std::convert::From<TextColor> for ::std::string::String {
    fn from(value: TextColor) -> Self {
        value.0
    }
}
impl ::std::convert::From<&TextColor> for TextColor {
    fn from(value: &TextColor) -> Self {
        value.clone()
    }
}
impl ::std::default::Default for TextColor {
    fn default() -> Self {
        TextColor("#000000".to_string())
    }
}
impl ::std::str::FromStr for TextColor {
    type Err = self::error::ConversionError;
    fn from_str(value: &str) -> ::std::result::Result<Self, self::error::ConversionError> {
        if value.chars().count() > 9usize {
            return Err("longer than 9 characters".into());
        }
        if value.chars().count() < 9usize {
            return Err("shorter than 9 characters".into());
        }
        static PATTERN: ::std::sync::LazyLock<::regress::Regex> =
            ::std::sync::LazyLock::new(|| ::regress::Regex::new("^#[0-9a-f]{8}$").unwrap());
        if PATTERN.find(value).is_none() {
            return Err("doesn't match pattern \"^#[0-9a-f]{8}$\"".into());
        }
        Ok(Self(value.to_string()))
    }
}
impl ::std::convert::TryFrom<&str> for TextColor {
    type Error = self::error::ConversionError;
    fn try_from(value: &str) -> ::std::result::Result<Self, self::error::ConversionError> {
        value.parse()
    }
}
impl ::std::convert::TryFrom<&::std::string::String> for TextColor {
    type Error = self::error::ConversionError;
    fn try_from(
        value: &::std::string::String,
    ) -> ::std::result::Result<Self, self::error::ConversionError> {
        value.parse()
    }
}
impl ::std::convert::TryFrom<::std::string::String> for TextColor {
    type Error = self::error::ConversionError;
    fn try_from(
        value: ::std::string::String,
    ) -> ::std::result::Result<Self, self::error::ConversionError> {
        value.parse()
    }
}
impl<'de> ::serde::Deserialize<'de> for TextColor {
    fn deserialize<D>(deserializer: D) -> ::std::result::Result<Self, D::Error>
    where
        D: ::serde::Deserializer<'de>,
    {
        ::std::string::String::deserialize(deserializer)?
            .parse()
            .map_err(|e: self::error::ConversionError| {
                <D::Error as ::serde::de::Error>::custom(e.to_string())
            })
    }
}
#[doc = "A Sensor that triggers when the specified time has elapsed since the start of the Node."]
#[doc = r""]
#[doc = r" <details><summary>JSON schema</summary>"]
#[doc = r""]
#[doc = r" ```json"]
#[doc = "{"]
#[doc = "  \"title\": \"TimeoutSensor\","]
#[doc = "  \"description\": \"A Sensor that triggers when the specified time has elapsed since the start of the Node.\","]
#[doc = "  \"type\": \"object\","]
#[doc = "  \"required\": ["]
#[doc = "    \"timeout_msec\""]
#[doc = "  ],"]
#[doc = "  \"properties\": {"]
#[doc = "    \"sensor_type\": {"]
#[doc = "      \"title\": \"Sensor Type\","]
#[doc = "      \"default\": \"TimeoutSensor\","]
#[doc = "      \"type\": \"string\","]
#[doc = "      \"const\": \"TimeoutSensor\""]
#[doc = "    },"]
#[doc = "    \"timeout_msec\": {"]
#[doc = "      \"title\": \"Timeout Msec\","]
#[doc = "      \"description\": \"The number of milliseconds from the start of the Node when the Sensor triggers.\","]
#[doc = "      \"type\": \"integer\","]
#[doc = "      \"minimum\": 0.0,"]
#[doc = "      \"exclusiveMinimum\": 0.0"]
#[doc = "    }"]
#[doc = "  }"]
#[doc = "}"]
#[doc = r" ```"]
#[doc = r" </details>"]
#[derive(:: serde :: Deserialize, :: serde :: Serialize, Clone, Debug)]
pub struct TimeoutSensor {
    #[serde(default = "defaults::timeout_sensor_sensor_type")]
    pub sensor_type: ::std::string::String,
    #[doc = "The number of milliseconds from the start of the Node when the Sensor triggers."]
    pub timeout_msec: ::std::num::NonZeroU64,
}
impl ::std::convert::From<&TimeoutSensor> for TimeoutSensor {
    fn from(value: &TimeoutSensor) -> Self {
        value.clone()
    }
}
impl TimeoutSensor {
    pub fn builder() -> builder::TimeoutSensor {
        Default::default()
    }
}
#[doc = "`Url`"]
#[doc = r""]
#[doc = r" <details><summary>JSON schema</summary>"]
#[doc = r""]
#[doc = r" ```json"]
#[doc = "{"]
#[doc = "  \"title\": \"URL\","]
#[doc = "  \"type\": \"object\","]
#[doc = "  \"required\": ["]
#[doc = "    \"url\""]
#[doc = "  ],"]
#[doc = "  \"properties\": {"]
#[doc = "    \"locator_type\": {"]
#[doc = "      \"title\": \"Locator Type\","]
#[doc = "      \"default\": \"URL\","]
#[doc = "      \"type\": \"string\","]
#[doc = "      \"const\": \"URL\""]
#[doc = "    },"]
#[doc = "    \"url\": {"]
#[doc = "      \"title\": \"Url\","]
#[doc = "      \"description\": \"The URL to the asset file. May be a relative or absolute URL.\","]
#[doc = "      \"type\": \"string\""]
#[doc = "    }"]
#[doc = "  }"]
#[doc = "}"]
#[doc = r" ```"]
#[doc = r" </details>"]
#[derive(:: serde :: Deserialize, :: serde :: Serialize, Clone, Debug)]
pub struct Url {
    #[serde(default = "defaults::url_locator_type")]
    pub locator_type: ::std::string::String,
    #[doc = "The URL to the asset file. May be a relative or absolute URL."]
    pub url: ::std::string::String,
}
impl ::std::convert::From<&Url> for Url {
    fn from(value: &Url) -> Self {
        value.clone()
    }
}
impl Url {
    pub fn builder() -> builder::Url {
        Default::default()
    }
}
#[doc = "`Video`"]
#[doc = r""]
#[doc = r" <details><summary>JSON schema</summary>"]
#[doc = r""]
#[doc = r" ```json"]
#[doc = "{"]
#[doc = "  \"title\": \"Video\","]
#[doc = "  \"type\": \"object\","]
#[doc = "  \"required\": ["]
#[doc = "    \"locator\","]
#[doc = "    \"media_type\","]
#[doc = "    \"sha256\""]
#[doc = "  ],"]
#[doc = "  \"properties\": {"]
#[doc = "    \"locator\": {"]
#[doc = "      \"description\": \"A location which is a claimed source of valid bytes for this Asset.\","]
#[doc = "      \"$ref\": \"#/$defs/AssetLocator\""]
#[doc = "    },"]
#[doc = "    \"media_type\": {"]
#[doc = "      \"description\": \"The IANA media (MIME) type of the video file.\","]
#[doc = "      \"$ref\": \"#/$defs/VideoMediaType\""]
#[doc = "    },"]
#[doc = "    \"sha256\": {"]
#[doc = "      \"title\": \"Sha256\","]
#[doc = "      \"description\": \"The SHA-256 hash of the asset file, as a hex string.\","]
#[doc = "      \"type\": \"string\","]
#[doc = "      \"pattern\": \"^[a-f0-9]{64}$\""]
#[doc = "    }"]
#[doc = "  }"]
#[doc = "}"]
#[doc = r" ```"]
#[doc = r" </details>"]
#[derive(:: serde :: Deserialize, :: serde :: Serialize, Clone, Debug)]
pub struct Video {
    #[doc = "A location which is a claimed source of valid bytes for this Asset."]
    pub locator: AssetLocator,
    #[doc = "The IANA media (MIME) type of the video file."]
    pub media_type: VideoMediaType,
    #[doc = "The SHA-256 hash of the asset file, as a hex string."]
    pub sha256: Sha256,
}
impl ::std::convert::From<&Video> for Video {
    fn from(value: &Video) -> Self {
        value.clone()
    }
}
impl Video {
    pub fn builder() -> builder::Video {
        Default::default()
    }
}
#[doc = "`VideoCard`"]
#[doc = r""]
#[doc = r" <details><summary>JSON schema</summary>"]
#[doc = r""]
#[doc = r" ```json"]
#[doc = "{"]
#[doc = "  \"title\": \"VideoCard\","]
#[doc = "  \"type\": \"object\","]
#[doc = "  \"required\": ["]
#[doc = "    \"h\","]
#[doc = "    \"video\","]
#[doc = "    \"w\","]
#[doc = "    \"x\","]
#[doc = "    \"y\""]
#[doc = "  ],"]
#[doc = "  \"properties\": {"]
#[doc = "    \"card_type\": {"]
#[doc = "      \"title\": \"Card Type\","]
#[doc = "      \"default\": \"VideoCard\","]
#[doc = "      \"type\": \"string\","]
#[doc = "      \"const\": \"VideoCard\""]
#[doc = "    },"]
#[doc = "    \"end_msec\": {"]
#[doc = "      \"title\": \"End Msec\","]
#[doc = "      \"description\": \"The time (in milliseconds) relative to Node start when the Card is removed from the Board.\","]
#[doc = "      \"default\": null,"]
#[doc = "      \"anyOf\": ["]
#[doc = "        {"]
#[doc = "          \"description\": \"A point in time relative to the start of a Node.\","]
#[doc = "          \"type\": \"integer\","]
#[doc = "          \"minimum\": 0.0"]
#[doc = "        },"]
#[doc = "        {"]
#[doc = "          \"type\": \"null\""]
#[doc = "        }"]
#[doc = "      ]"]
#[doc = "    },"]
#[doc = "    \"h\": {"]
#[doc = "      \"description\": \"The height of the Card, in Board units.\","]
#[doc = "      \"$ref\": \"#/$defs/nodekit___internal__types__common__SpatialSize__1\""]
#[doc = "    },"]
#[doc = "    \"loop\": {"]
#[doc = "      \"title\": \"Loop\","]
#[doc = "      \"description\": \"Whether to loop the video when it ends.\","]
#[doc = "      \"default\": false,"]
#[doc = "      \"type\": \"boolean\""]
#[doc = "    },"]
#[doc = "    \"muted\": {"]
#[doc = "      \"title\": \"Muted\","]
#[doc = "      \"description\": \"Whether to mute the video audio.\","]
#[doc = "      \"default\": true,"]
#[doc = "      \"type\": \"boolean\""]
#[doc = "    },"]
#[doc = "    \"start\": {"]
#[doc = "      \"title\": \"Start\","]
#[doc = "      \"description\": \"Whether to play the video, or not\","]
#[doc = "      \"default\": true,"]
#[doc = "      \"type\": \"boolean\""]
#[doc = "    },"]
#[doc = "    \"start_msec\": {"]
#[doc = "      \"title\": \"Start Msec\","]
#[doc = "      \"description\": \"The time (in milliseconds) relative to Node start when the Card is placed on the Board.\","]
#[doc = "      \"default\": 0,"]
#[doc = "      \"type\": \"integer\","]
#[doc = "      \"minimum\": 0.0"]
#[doc = "    },"]
#[doc = "    \"video\": {"]
#[doc = "      \"$ref\": \"#/$defs/Video\""]
#[doc = "    },"]
#[doc = "    \"w\": {"]
#[doc = "      \"description\": \"The width of the Card, in Board units.\","]
#[doc = "      \"$ref\": \"#/$defs/nodekit___internal__types__common__SpatialSize__1\""]
#[doc = "    },"]
#[doc = "    \"x\": {"]
#[doc = "      \"description\": \"The x-coordinate of the Card center on the Board. 0 is the center of the Board. An increase in x moves right.\","]
#[doc = "      \"$ref\": \"#/$defs/SpatialPoint\""]
#[doc = "    },"]
#[doc = "    \"y\": {"]
#[doc = "      \"description\": \"The y-coordinate of the Card center on the Board. 0 is the center of the Board. An increase in y moves up.\","]
#[doc = "      \"$ref\": \"#/$defs/SpatialPoint\""]
#[doc = "    },"]
#[doc = "    \"z_index\": {"]
#[doc = "      \"title\": \"Z Index\","]
#[doc = "      \"default\": null,"]
#[doc = "      \"anyOf\": ["]
#[doc = "        {"]
#[doc = "          \"type\": \"integer\""]
#[doc = "        },"]
#[doc = "        {"]
#[doc = "          \"type\": \"null\""]
#[doc = "        }"]
#[doc = "      ]"]
#[doc = "    }"]
#[doc = "  }"]
#[doc = "}"]
#[doc = r" ```"]
#[doc = r" </details>"]
#[derive(:: serde :: Deserialize, :: serde :: Serialize, Clone, Debug)]
pub struct VideoCard {
    #[serde(default = "defaults::video_card_card_type")]
    pub card_type: ::std::string::String,
    #[doc = "The time (in milliseconds) relative to Node start when the Card is removed from the Board."]
    #[serde(default, skip_serializing_if = "::std::option::Option::is_none")]
    pub end_msec: ::std::option::Option<u64>,
    #[doc = "The height of the Card, in Board units."]
    pub h: NodekitInternalTypesCommonSpatialSize1,
    #[doc = "Whether to loop the video when it ends."]
    #[serde(rename = "loop", default)]
    pub loop_: bool,
    #[doc = "Whether to mute the video audio."]
    #[serde(default = "defaults::default_bool::<true>")]
    pub muted: bool,
    #[doc = "Whether to play the video, or not"]
    #[serde(default = "defaults::default_bool::<true>")]
    pub start: bool,
    #[doc = "The time (in milliseconds) relative to Node start when the Card is placed on the Board."]
    #[serde(default)]
    pub start_msec: u64,
    pub video: Video,
    #[doc = "The width of the Card, in Board units."]
    pub w: NodekitInternalTypesCommonSpatialSize1,
    #[doc = "The x-coordinate of the Card center on the Board. 0 is the center of the Board. An increase in x moves right."]
    pub x: SpatialPoint,
    #[doc = "The y-coordinate of the Card center on the Board. 0 is the center of the Board. An increase in y moves up."]
    pub y: SpatialPoint,
    #[serde(default, skip_serializing_if = "::std::option::Option::is_none")]
    pub z_index: ::std::option::Option<i64>,
}
impl ::std::convert::From<&VideoCard> for VideoCard {
    fn from(value: &VideoCard) -> Self {
        value.clone()
    }
}
impl VideoCard {
    pub fn builder() -> builder::VideoCard {
        Default::default()
    }
}
#[doc = "`VideoMediaType`"]
#[doc = r""]
#[doc = r" <details><summary>JSON schema</summary>"]
#[doc = r""]
#[doc = r" ```json"]
#[doc = "{"]
#[doc = "  \"type\": \"string\","]
#[doc = "  \"const\": \"video/mp4\""]
#[doc = "}"]
#[doc = r" ```"]
#[doc = r" </details>"]
#[derive(
    :: serde :: Deserialize,
    :: serde :: Serialize,
    Clone,
    Debug,
    Eq,
    Hash,
    Ord,
    PartialEq,
    PartialOrd,
)]
#[serde(transparent)]
pub struct VideoMediaType(pub ::std::string::String);
impl ::std::ops::Deref for VideoMediaType {
    type Target = ::std::string::String;
    fn deref(&self) -> &::std::string::String {
        &self.0
    }
}
impl ::std::convert::From<VideoMediaType> for ::std::string::String {
    fn from(value: VideoMediaType) -> Self {
        value.0
    }
}
impl ::std::convert::From<&VideoMediaType> for VideoMediaType {
    fn from(value: &VideoMediaType) -> Self {
        value.clone()
    }
}
impl ::std::convert::From<::std::string::String> for VideoMediaType {
    fn from(value: ::std::string::String) -> Self {
        Self(value)
    }
}
impl ::std::str::FromStr for VideoMediaType {
    type Err = ::std::convert::Infallible;
    fn from_str(value: &str) -> ::std::result::Result<Self, Self::Err> {
        Ok(Self(value.to_string()))
    }
}
impl ::std::fmt::Display for VideoMediaType {
    fn fmt(&self, f: &mut ::std::fmt::Formatter<'_>) -> ::std::fmt::Result {
        self.0.fmt(f)
    }
}
#[doc = "`ZipArchiveInnerPath`"]
#[doc = r""]
#[doc = r" <details><summary>JSON schema</summary>"]
#[doc = r""]
#[doc = r" ```json"]
#[doc = "{"]
#[doc = "  \"title\": \"ZipArchiveInnerPath\","]
#[doc = "  \"type\": \"object\","]
#[doc = "  \"required\": ["]
#[doc = "    \"inner_path\","]
#[doc = "    \"zip_archive_path\""]
#[doc = "  ],"]
#[doc = "  \"properties\": {"]
#[doc = "    \"inner_path\": {"]
#[doc = "      \"title\": \"Inner Path\","]
#[doc = "      \"description\": \"The internal path within the zip archive to the asset file.\","]
#[doc = "      \"type\": \"string\","]
#[doc = "      \"format\": \"path\""]
#[doc = "    },"]
#[doc = "    \"locator_type\": {"]
#[doc = "      \"title\": \"Locator Type\","]
#[doc = "      \"default\": \"ZipArchiveInnerPath\","]
#[doc = "      \"type\": \"string\","]
#[doc = "      \"const\": \"ZipArchiveInnerPath\""]
#[doc = "    },"]
#[doc = "    \"zip_archive_path\": {"]
#[doc = "      \"title\": \"Zip Archive Path\","]
#[doc = "      \"description\": \"The path to the zip archive file on the local filesystem\","]
#[doc = "      \"type\": \"string\","]
#[doc = "      \"format\": \"file-path\""]
#[doc = "    }"]
#[doc = "  }"]
#[doc = "}"]
#[doc = r" ```"]
#[doc = r" </details>"]
#[derive(:: serde :: Deserialize, :: serde :: Serialize, Clone, Debug)]
pub struct ZipArchiveInnerPath {
    #[doc = "The internal path within the zip archive to the asset file."]
    pub inner_path: ::std::string::String,
    #[serde(default = "defaults::zip_archive_inner_path_locator_type")]
    pub locator_type: ::std::string::String,
    #[doc = "The path to the zip archive file on the local filesystem"]
    pub zip_archive_path: ::std::string::String,
}
impl ::std::convert::From<&ZipArchiveInnerPath> for ZipArchiveInnerPath {
    fn from(value: &ZipArchiveInnerPath) -> Self {
        value.clone()
    }
}
impl ZipArchiveInnerPath {
    pub fn builder() -> builder::ZipArchiveInnerPath {
        Default::default()
    }
}
#[doc = r" Types for composing complex structures."]
pub mod builder {
    #[derive(Clone, Debug)]
    pub struct ClickSensor {
        end_msec: ::std::result::Result<::std::option::Option<u64>, ::std::string::String>,
        h: ::std::result::Result<
            super::NodekitInternalTypesCommonSpatialSize2,
            ::std::string::String,
        >,
        mask: ::std::result::Result<super::Mask, ::std::string::String>,
        sensor_type: ::std::result::Result<::std::string::String, ::std::string::String>,
        start_msec: ::std::result::Result<u64, ::std::string::String>,
        w: ::std::result::Result<
            super::NodekitInternalTypesCommonSpatialSize2,
            ::std::string::String,
        >,
        x: ::std::result::Result<super::SpatialPoint, ::std::string::String>,
        y: ::std::result::Result<super::SpatialPoint, ::std::string::String>,
    }
    impl ::std::default::Default for ClickSensor {
        fn default() -> Self {
            Self {
                end_msec: Ok(Default::default()),
                h: Err("no value supplied for h".to_string()),
                mask: Ok(super::defaults::click_sensor_mask()),
                sensor_type: Ok(super::defaults::click_sensor_sensor_type()),
                start_msec: Ok(Default::default()),
                w: Err("no value supplied for w".to_string()),
                x: Err("no value supplied for x".to_string()),
                y: Err("no value supplied for y".to_string()),
            }
        }
    }
    impl ClickSensor {
        pub fn end_msec<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::option::Option<u64>>,
            T::Error: ::std::fmt::Display,
        {
            self.end_msec = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for end_msec: {}", e));
            self
        }
        pub fn h<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<super::NodekitInternalTypesCommonSpatialSize2>,
            T::Error: ::std::fmt::Display,
        {
            self.h = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for h: {}", e));
            self
        }
        pub fn mask<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<super::Mask>,
            T::Error: ::std::fmt::Display,
        {
            self.mask = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for mask: {}", e));
            self
        }
        pub fn sensor_type<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::string::String>,
            T::Error: ::std::fmt::Display,
        {
            self.sensor_type = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for sensor_type: {}", e));
            self
        }
        pub fn start_msec<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<u64>,
            T::Error: ::std::fmt::Display,
        {
            self.start_msec = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for start_msec: {}", e));
            self
        }
        pub fn w<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<super::NodekitInternalTypesCommonSpatialSize2>,
            T::Error: ::std::fmt::Display,
        {
            self.w = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for w: {}", e));
            self
        }
        pub fn x<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<super::SpatialPoint>,
            T::Error: ::std::fmt::Display,
        {
            self.x = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for x: {}", e));
            self
        }
        pub fn y<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<super::SpatialPoint>,
            T::Error: ::std::fmt::Display,
        {
            self.y = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for y: {}", e));
            self
        }
    }
    impl ::std::convert::TryFrom<ClickSensor> for super::ClickSensor {
        type Error = super::error::ConversionError;
        fn try_from(
            value: ClickSensor,
        ) -> ::std::result::Result<Self, super::error::ConversionError> {
            Ok(Self {
                end_msec: value.end_msec?,
                h: value.h?,
                mask: value.mask?,
                sensor_type: value.sensor_type?,
                start_msec: value.start_msec?,
                w: value.w?,
                x: value.x?,
                y: value.y?,
            })
        }
    }
    impl ::std::convert::From<super::ClickSensor> for ClickSensor {
        fn from(value: super::ClickSensor) -> Self {
            Self {
                end_msec: Ok(value.end_msec),
                h: Ok(value.h),
                mask: Ok(value.mask),
                sensor_type: Ok(value.sensor_type),
                start_msec: Ok(value.start_msec),
                w: Ok(value.w),
                x: Ok(value.x),
                y: Ok(value.y),
            }
        }
    }
    #[derive(Clone, Debug)]
    pub struct FileSystemPath {
        locator_type: ::std::result::Result<::std::string::String, ::std::string::String>,
        path: ::std::result::Result<::std::string::String, ::std::string::String>,
    }
    impl ::std::default::Default for FileSystemPath {
        fn default() -> Self {
            Self {
                locator_type: Ok(super::defaults::file_system_path_locator_type()),
                path: Err("no value supplied for path".to_string()),
            }
        }
    }
    impl FileSystemPath {
        pub fn locator_type<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::string::String>,
            T::Error: ::std::fmt::Display,
        {
            self.locator_type = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for locator_type: {}", e));
            self
        }
        pub fn path<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::string::String>,
            T::Error: ::std::fmt::Display,
        {
            self.path = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for path: {}", e));
            self
        }
    }
    impl ::std::convert::TryFrom<FileSystemPath> for super::FileSystemPath {
        type Error = super::error::ConversionError;
        fn try_from(
            value: FileSystemPath,
        ) -> ::std::result::Result<Self, super::error::ConversionError> {
            Ok(Self {
                locator_type: value.locator_type?,
                path: value.path?,
            })
        }
    }
    impl ::std::convert::From<super::FileSystemPath> for FileSystemPath {
        fn from(value: super::FileSystemPath) -> Self {
            Self {
                locator_type: Ok(value.locator_type),
                path: Ok(value.path),
            }
        }
    }
    #[derive(Clone, Debug)]
    pub struct FreeTextEntryCard {
        background_color: ::std::result::Result<super::BackgroundColor, ::std::string::String>,
        card_type: ::std::result::Result<::std::string::String, ::std::string::String>,
        end_msec: ::std::result::Result<::std::option::Option<u64>, ::std::string::String>,
        font_size: ::std::result::Result<
            super::NodekitInternalTypesCommonSpatialSize1,
            ::std::string::String,
        >,
        h: ::std::result::Result<
            super::NodekitInternalTypesCommonSpatialSize1,
            ::std::string::String,
        >,
        max_length: ::std::result::Result<
            ::std::option::Option<::std::num::NonZeroU64>,
            ::std::string::String,
        >,
        prompt: ::std::result::Result<::std::string::String, ::std::string::String>,
        start_msec: ::std::result::Result<u64, ::std::string::String>,
        text_color: ::std::result::Result<super::TextColor, ::std::string::String>,
        w: ::std::result::Result<
            super::NodekitInternalTypesCommonSpatialSize1,
            ::std::string::String,
        >,
        x: ::std::result::Result<super::SpatialPoint, ::std::string::String>,
        y: ::std::result::Result<super::SpatialPoint, ::std::string::String>,
        z_index: ::std::result::Result<::std::option::Option<i64>, ::std::string::String>,
    }
    impl ::std::default::Default for FreeTextEntryCard {
        fn default() -> Self {
            Self {
                background_color: Ok(super::defaults::free_text_entry_card_background_color()),
                card_type: Ok(super::defaults::free_text_entry_card_card_type()),
                end_msec: Ok(Default::default()),
                font_size: Ok(super::defaults::free_text_entry_card_font_size()),
                h: Err("no value supplied for h".to_string()),
                max_length: Ok(Default::default()),
                prompt: Ok(Default::default()),
                start_msec: Ok(Default::default()),
                text_color: Ok(super::defaults::free_text_entry_card_text_color()),
                w: Err("no value supplied for w".to_string()),
                x: Err("no value supplied for x".to_string()),
                y: Err("no value supplied for y".to_string()),
                z_index: Ok(Default::default()),
            }
        }
    }
    impl FreeTextEntryCard {
        pub fn background_color<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<super::BackgroundColor>,
            T::Error: ::std::fmt::Display,
        {
            self.background_color = value.try_into().map_err(|e| {
                format!(
                    "error converting supplied value for background_color: {}",
                    e
                )
            });
            self
        }
        pub fn card_type<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::string::String>,
            T::Error: ::std::fmt::Display,
        {
            self.card_type = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for card_type: {}", e));
            self
        }
        pub fn end_msec<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::option::Option<u64>>,
            T::Error: ::std::fmt::Display,
        {
            self.end_msec = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for end_msec: {}", e));
            self
        }
        pub fn font_size<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<super::NodekitInternalTypesCommonSpatialSize1>,
            T::Error: ::std::fmt::Display,
        {
            self.font_size = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for font_size: {}", e));
            self
        }
        pub fn h<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<super::NodekitInternalTypesCommonSpatialSize1>,
            T::Error: ::std::fmt::Display,
        {
            self.h = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for h: {}", e));
            self
        }
        pub fn max_length<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::option::Option<::std::num::NonZeroU64>>,
            T::Error: ::std::fmt::Display,
        {
            self.max_length = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for max_length: {}", e));
            self
        }
        pub fn prompt<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::string::String>,
            T::Error: ::std::fmt::Display,
        {
            self.prompt = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for prompt: {}", e));
            self
        }
        pub fn start_msec<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<u64>,
            T::Error: ::std::fmt::Display,
        {
            self.start_msec = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for start_msec: {}", e));
            self
        }
        pub fn text_color<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<super::TextColor>,
            T::Error: ::std::fmt::Display,
        {
            self.text_color = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for text_color: {}", e));
            self
        }
        pub fn w<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<super::NodekitInternalTypesCommonSpatialSize1>,
            T::Error: ::std::fmt::Display,
        {
            self.w = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for w: {}", e));
            self
        }
        pub fn x<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<super::SpatialPoint>,
            T::Error: ::std::fmt::Display,
        {
            self.x = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for x: {}", e));
            self
        }
        pub fn y<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<super::SpatialPoint>,
            T::Error: ::std::fmt::Display,
        {
            self.y = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for y: {}", e));
            self
        }
        pub fn z_index<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::option::Option<i64>>,
            T::Error: ::std::fmt::Display,
        {
            self.z_index = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for z_index: {}", e));
            self
        }
    }
    impl ::std::convert::TryFrom<FreeTextEntryCard> for super::FreeTextEntryCard {
        type Error = super::error::ConversionError;
        fn try_from(
            value: FreeTextEntryCard,
        ) -> ::std::result::Result<Self, super::error::ConversionError> {
            Ok(Self {
                background_color: value.background_color?,
                card_type: value.card_type?,
                end_msec: value.end_msec?,
                font_size: value.font_size?,
                h: value.h?,
                max_length: value.max_length?,
                prompt: value.prompt?,
                start_msec: value.start_msec?,
                text_color: value.text_color?,
                w: value.w?,
                x: value.x?,
                y: value.y?,
                z_index: value.z_index?,
            })
        }
    }
    impl ::std::convert::From<super::FreeTextEntryCard> for FreeTextEntryCard {
        fn from(value: super::FreeTextEntryCard) -> Self {
            Self {
                background_color: Ok(value.background_color),
                card_type: Ok(value.card_type),
                end_msec: Ok(value.end_msec),
                font_size: Ok(value.font_size),
                h: Ok(value.h),
                max_length: Ok(value.max_length),
                prompt: Ok(value.prompt),
                start_msec: Ok(value.start_msec),
                text_color: Ok(value.text_color),
                w: Ok(value.w),
                x: Ok(value.x),
                y: Ok(value.y),
                z_index: Ok(value.z_index),
            }
        }
    }
    #[derive(Clone, Debug)]
    pub struct Graph {
        nodekit_version: ::std::result::Result<::std::string::String, ::std::string::String>,
        nodes: ::std::result::Result<
            ::std::collections::HashMap<::std::string::String, super::Node>,
            ::std::string::String,
        >,
        start: ::std::result::Result<::std::string::String, ::std::string::String>,
        transitions: ::std::result::Result<
            ::std::collections::HashMap<
                ::std::string::String,
                ::std::collections::HashMap<::std::string::String, ::std::string::String>,
            >,
            ::std::string::String,
        >,
    }
    impl ::std::default::Default for Graph {
        fn default() -> Self {
            Self {
                nodekit_version: Ok(super::defaults::graph_nodekit_version()),
                nodes: Err("no value supplied for nodes".to_string()),
                start: Err("no value supplied for start".to_string()),
                transitions: Err("no value supplied for transitions".to_string()),
            }
        }
    }
    impl Graph {
        pub fn nodekit_version<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::string::String>,
            T::Error: ::std::fmt::Display,
        {
            self.nodekit_version = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for nodekit_version: {}", e));
            self
        }
        pub fn nodes<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<
                ::std::collections::HashMap<::std::string::String, super::Node>,
            >,
            T::Error: ::std::fmt::Display,
        {
            self.nodes = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for nodes: {}", e));
            self
        }
        pub fn start<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::string::String>,
            T::Error: ::std::fmt::Display,
        {
            self.start = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for start: {}", e));
            self
        }
        pub fn transitions<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<
                ::std::collections::HashMap<
                    ::std::string::String,
                    ::std::collections::HashMap<::std::string::String, ::std::string::String>,
                >,
            >,
            T::Error: ::std::fmt::Display,
        {
            self.transitions = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for transitions: {}", e));
            self
        }
    }
    impl ::std::convert::TryFrom<Graph> for super::Graph {
        type Error = super::error::ConversionError;
        fn try_from(value: Graph) -> ::std::result::Result<Self, super::error::ConversionError> {
            Ok(Self {
                nodekit_version: value.nodekit_version?,
                nodes: value.nodes?,
                start: value.start?,
                transitions: value.transitions?,
            })
        }
    }
    impl ::std::convert::From<super::Graph> for Graph {
        fn from(value: super::Graph) -> Self {
            Self {
                nodekit_version: Ok(value.nodekit_version),
                nodes: Ok(value.nodes),
                start: Ok(value.start),
                transitions: Ok(value.transitions),
            }
        }
    }
    #[derive(Clone, Debug)]
    pub struct HidePointerEffect {
        effect_type: ::std::result::Result<::std::string::String, ::std::string::String>,
        end_msec: ::std::result::Result<u64, ::std::string::String>,
        start_msec: ::std::result::Result<u64, ::std::string::String>,
    }
    impl ::std::default::Default for HidePointerEffect {
        fn default() -> Self {
            Self {
                effect_type: Ok(super::defaults::hide_pointer_effect_effect_type()),
                end_msec: Err("no value supplied for end_msec".to_string()),
                start_msec: Ok(Default::default()),
            }
        }
    }
    impl HidePointerEffect {
        pub fn effect_type<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::string::String>,
            T::Error: ::std::fmt::Display,
        {
            self.effect_type = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for effect_type: {}", e));
            self
        }
        pub fn end_msec<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<u64>,
            T::Error: ::std::fmt::Display,
        {
            self.end_msec = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for end_msec: {}", e));
            self
        }
        pub fn start_msec<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<u64>,
            T::Error: ::std::fmt::Display,
        {
            self.start_msec = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for start_msec: {}", e));
            self
        }
    }
    impl ::std::convert::TryFrom<HidePointerEffect> for super::HidePointerEffect {
        type Error = super::error::ConversionError;
        fn try_from(
            value: HidePointerEffect,
        ) -> ::std::result::Result<Self, super::error::ConversionError> {
            Ok(Self {
                effect_type: value.effect_type?,
                end_msec: value.end_msec?,
                start_msec: value.start_msec?,
            })
        }
    }
    impl ::std::convert::From<super::HidePointerEffect> for HidePointerEffect {
        fn from(value: super::HidePointerEffect) -> Self {
            Self {
                effect_type: Ok(value.effect_type),
                end_msec: Ok(value.end_msec),
                start_msec: Ok(value.start_msec),
            }
        }
    }
    #[derive(Clone, Debug)]
    pub struct Image {
        locator: ::std::result::Result<super::AssetLocator, ::std::string::String>,
        media_type: ::std::result::Result<super::ImageMediaType, ::std::string::String>,
        sha256: ::std::result::Result<super::Sha256, ::std::string::String>,
    }
    impl ::std::default::Default for Image {
        fn default() -> Self {
            Self {
                locator: Err("no value supplied for locator".to_string()),
                media_type: Err("no value supplied for media_type".to_string()),
                sha256: Err("no value supplied for sha256".to_string()),
            }
        }
    }
    impl Image {
        pub fn locator<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<super::AssetLocator>,
            T::Error: ::std::fmt::Display,
        {
            self.locator = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for locator: {}", e));
            self
        }
        pub fn media_type<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<super::ImageMediaType>,
            T::Error: ::std::fmt::Display,
        {
            self.media_type = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for media_type: {}", e));
            self
        }
        pub fn sha256<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<super::Sha256>,
            T::Error: ::std::fmt::Display,
        {
            self.sha256 = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for sha256: {}", e));
            self
        }
    }
    impl ::std::convert::TryFrom<Image> for super::Image {
        type Error = super::error::ConversionError;
        fn try_from(value: Image) -> ::std::result::Result<Self, super::error::ConversionError> {
            Ok(Self {
                locator: value.locator?,
                media_type: value.media_type?,
                sha256: value.sha256?,
            })
        }
    }
    impl ::std::convert::From<super::Image> for Image {
        fn from(value: super::Image) -> Self {
            Self {
                locator: Ok(value.locator),
                media_type: Ok(value.media_type),
                sha256: Ok(value.sha256),
            }
        }
    }
    #[derive(Clone, Debug)]
    pub struct ImageCard {
        card_type: ::std::result::Result<::std::string::String, ::std::string::String>,
        end_msec: ::std::result::Result<::std::option::Option<u64>, ::std::string::String>,
        h: ::std::result::Result<
            super::NodekitInternalTypesCommonSpatialSize1,
            ::std::string::String,
        >,
        image: ::std::result::Result<super::Image, ::std::string::String>,
        start_msec: ::std::result::Result<u64, ::std::string::String>,
        w: ::std::result::Result<
            super::NodekitInternalTypesCommonSpatialSize1,
            ::std::string::String,
        >,
        x: ::std::result::Result<super::SpatialPoint, ::std::string::String>,
        y: ::std::result::Result<super::SpatialPoint, ::std::string::String>,
        z_index: ::std::result::Result<::std::option::Option<i64>, ::std::string::String>,
    }
    impl ::std::default::Default for ImageCard {
        fn default() -> Self {
            Self {
                card_type: Ok(super::defaults::image_card_card_type()),
                end_msec: Ok(Default::default()),
                h: Err("no value supplied for h".to_string()),
                image: Err("no value supplied for image".to_string()),
                start_msec: Ok(Default::default()),
                w: Err("no value supplied for w".to_string()),
                x: Err("no value supplied for x".to_string()),
                y: Err("no value supplied for y".to_string()),
                z_index: Ok(Default::default()),
            }
        }
    }
    impl ImageCard {
        pub fn card_type<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::string::String>,
            T::Error: ::std::fmt::Display,
        {
            self.card_type = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for card_type: {}", e));
            self
        }
        pub fn end_msec<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::option::Option<u64>>,
            T::Error: ::std::fmt::Display,
        {
            self.end_msec = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for end_msec: {}", e));
            self
        }
        pub fn h<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<super::NodekitInternalTypesCommonSpatialSize1>,
            T::Error: ::std::fmt::Display,
        {
            self.h = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for h: {}", e));
            self
        }
        pub fn image<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<super::Image>,
            T::Error: ::std::fmt::Display,
        {
            self.image = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for image: {}", e));
            self
        }
        pub fn start_msec<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<u64>,
            T::Error: ::std::fmt::Display,
        {
            self.start_msec = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for start_msec: {}", e));
            self
        }
        pub fn w<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<super::NodekitInternalTypesCommonSpatialSize1>,
            T::Error: ::std::fmt::Display,
        {
            self.w = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for w: {}", e));
            self
        }
        pub fn x<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<super::SpatialPoint>,
            T::Error: ::std::fmt::Display,
        {
            self.x = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for x: {}", e));
            self
        }
        pub fn y<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<super::SpatialPoint>,
            T::Error: ::std::fmt::Display,
        {
            self.y = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for y: {}", e));
            self
        }
        pub fn z_index<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::option::Option<i64>>,
            T::Error: ::std::fmt::Display,
        {
            self.z_index = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for z_index: {}", e));
            self
        }
    }
    impl ::std::convert::TryFrom<ImageCard> for super::ImageCard {
        type Error = super::error::ConversionError;
        fn try_from(
            value: ImageCard,
        ) -> ::std::result::Result<Self, super::error::ConversionError> {
            Ok(Self {
                card_type: value.card_type?,
                end_msec: value.end_msec?,
                h: value.h?,
                image: value.image?,
                start_msec: value.start_msec?,
                w: value.w?,
                x: value.x?,
                y: value.y?,
                z_index: value.z_index?,
            })
        }
    }
    impl ::std::convert::From<super::ImageCard> for ImageCard {
        fn from(value: super::ImageCard) -> Self {
            Self {
                card_type: Ok(value.card_type),
                end_msec: Ok(value.end_msec),
                h: Ok(value.h),
                image: Ok(value.image),
                start_msec: Ok(value.start_msec),
                w: Ok(value.w),
                x: Ok(value.x),
                y: Ok(value.y),
                z_index: Ok(value.z_index),
            }
        }
    }
    #[derive(Clone, Debug)]
    pub struct KeySensor {
        end_msec: ::std::result::Result<::std::option::Option<u64>, ::std::string::String>,
        key: ::std::result::Result<super::Key, ::std::string::String>,
        sensor_type: ::std::result::Result<::std::string::String, ::std::string::String>,
        start_msec: ::std::result::Result<u64, ::std::string::String>,
    }
    impl ::std::default::Default for KeySensor {
        fn default() -> Self {
            Self {
                end_msec: Ok(Default::default()),
                key: Err("no value supplied for key".to_string()),
                sensor_type: Ok(super::defaults::key_sensor_sensor_type()),
                start_msec: Ok(Default::default()),
            }
        }
    }
    impl KeySensor {
        pub fn end_msec<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::option::Option<u64>>,
            T::Error: ::std::fmt::Display,
        {
            self.end_msec = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for end_msec: {}", e));
            self
        }
        pub fn key<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<super::Key>,
            T::Error: ::std::fmt::Display,
        {
            self.key = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for key: {}", e));
            self
        }
        pub fn sensor_type<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::string::String>,
            T::Error: ::std::fmt::Display,
        {
            self.sensor_type = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for sensor_type: {}", e));
            self
        }
        pub fn start_msec<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<u64>,
            T::Error: ::std::fmt::Display,
        {
            self.start_msec = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for start_msec: {}", e));
            self
        }
    }
    impl ::std::convert::TryFrom<KeySensor> for super::KeySensor {
        type Error = super::error::ConversionError;
        fn try_from(
            value: KeySensor,
        ) -> ::std::result::Result<Self, super::error::ConversionError> {
            Ok(Self {
                end_msec: value.end_msec?,
                key: value.key?,
                sensor_type: value.sensor_type?,
                start_msec: value.start_msec?,
            })
        }
    }
    impl ::std::convert::From<super::KeySensor> for KeySensor {
        fn from(value: super::KeySensor) -> Self {
            Self {
                end_msec: Ok(value.end_msec),
                key: Ok(value.key),
                sensor_type: Ok(value.sensor_type),
                start_msec: Ok(value.start_msec),
            }
        }
    }
    #[derive(Clone, Debug)]
    pub struct Node {
        annotation: ::std::result::Result<super::JsonValue, ::std::string::String>,
        board_color: ::std::result::Result<super::BoardColor, ::std::string::String>,
        cards: ::std::result::Result<
            ::std::collections::HashMap<::std::string::String, super::NodeCardsValue>,
            ::std::string::String,
        >,
        effects: ::std::result::Result<::std::vec::Vec<super::Effect>, ::std::string::String>,
        sensors: ::std::result::Result<
            ::std::collections::HashMap<::std::string::String, super::NodeSensorsValue>,
            ::std::string::String,
        >,
    }
    impl ::std::default::Default for Node {
        fn default() -> Self {
            Self {
                annotation: Ok(super::defaults::node_annotation()),
                board_color: Ok(super::defaults::node_board_color()),
                cards: Err("no value supplied for cards".to_string()),
                effects: Ok(Default::default()),
                sensors: Err("no value supplied for sensors".to_string()),
            }
        }
    }
    impl Node {
        pub fn annotation<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<super::JsonValue>,
            T::Error: ::std::fmt::Display,
        {
            self.annotation = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for annotation: {}", e));
            self
        }
        pub fn board_color<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<super::BoardColor>,
            T::Error: ::std::fmt::Display,
        {
            self.board_color = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for board_color: {}", e));
            self
        }
        pub fn cards<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<
                ::std::collections::HashMap<::std::string::String, super::NodeCardsValue>,
            >,
            T::Error: ::std::fmt::Display,
        {
            self.cards = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for cards: {}", e));
            self
        }
        pub fn effects<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::vec::Vec<super::Effect>>,
            T::Error: ::std::fmt::Display,
        {
            self.effects = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for effects: {}", e));
            self
        }
        pub fn sensors<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<
                ::std::collections::HashMap<::std::string::String, super::NodeSensorsValue>,
            >,
            T::Error: ::std::fmt::Display,
        {
            self.sensors = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for sensors: {}", e));
            self
        }
    }
    impl ::std::convert::TryFrom<Node> for super::Node {
        type Error = super::error::ConversionError;
        fn try_from(value: Node) -> ::std::result::Result<Self, super::error::ConversionError> {
            Ok(Self {
                annotation: value.annotation?,
                board_color: value.board_color?,
                cards: value.cards?,
                effects: value.effects?,
                sensors: value.sensors?,
            })
        }
    }
    impl ::std::convert::From<super::Node> for Node {
        fn from(value: super::Node) -> Self {
            Self {
                annotation: Ok(value.annotation),
                board_color: Ok(value.board_color),
                cards: Ok(value.cards),
                effects: Ok(value.effects),
                sensors: Ok(value.sensors),
            }
        }
    }
    #[derive(Clone, Debug)]
    pub struct RelativePath {
        locator_type: ::std::result::Result<::std::string::String, ::std::string::String>,
        relative_path: ::std::result::Result<::std::string::String, ::std::string::String>,
    }
    impl ::std::default::Default for RelativePath {
        fn default() -> Self {
            Self {
                locator_type: Ok(super::defaults::relative_path_locator_type()),
                relative_path: Err("no value supplied for relative_path".to_string()),
            }
        }
    }
    impl RelativePath {
        pub fn locator_type<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::string::String>,
            T::Error: ::std::fmt::Display,
        {
            self.locator_type = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for locator_type: {}", e));
            self
        }
        pub fn relative_path<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::string::String>,
            T::Error: ::std::fmt::Display,
        {
            self.relative_path = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for relative_path: {}", e));
            self
        }
    }
    impl ::std::convert::TryFrom<RelativePath> for super::RelativePath {
        type Error = super::error::ConversionError;
        fn try_from(
            value: RelativePath,
        ) -> ::std::result::Result<Self, super::error::ConversionError> {
            Ok(Self {
                locator_type: value.locator_type?,
                relative_path: value.relative_path?,
            })
        }
    }
    impl ::std::convert::From<super::RelativePath> for RelativePath {
        fn from(value: super::RelativePath) -> Self {
            Self {
                locator_type: Ok(value.locator_type),
                relative_path: Ok(value.relative_path),
            }
        }
    }
    #[derive(Clone, Debug)]
    pub struct SliderCard {
        card_type: ::std::result::Result<::std::string::String, ::std::string::String>,
        end_msec: ::std::result::Result<::std::option::Option<u64>, ::std::string::String>,
        h: ::std::result::Result<
            super::NodekitInternalTypesCommonSpatialSize1,
            ::std::string::String,
        >,
        initial_bin_index: ::std::result::Result<::std::option::Option<u64>, ::std::string::String>,
        num_bins: ::std::result::Result<i64, ::std::string::String>,
        orientation: ::std::result::Result<super::Orientation, ::std::string::String>,
        show_bin_markers: ::std::result::Result<bool, ::std::string::String>,
        start_msec: ::std::result::Result<u64, ::std::string::String>,
        w: ::std::result::Result<
            super::NodekitInternalTypesCommonSpatialSize1,
            ::std::string::String,
        >,
        x: ::std::result::Result<super::SpatialPoint, ::std::string::String>,
        y: ::std::result::Result<super::SpatialPoint, ::std::string::String>,
        z_index: ::std::result::Result<::std::option::Option<i64>, ::std::string::String>,
    }
    impl ::std::default::Default for SliderCard {
        fn default() -> Self {
            Self {
                card_type: Ok(super::defaults::slider_card_card_type()),
                end_msec: Ok(Default::default()),
                h: Err("no value supplied for h".to_string()),
                initial_bin_index: Ok(Default::default()),
                num_bins: Ok(super::defaults::default_u64::<i64, 7>()),
                orientation: Ok(super::defaults::slider_card_orientation()),
                show_bin_markers: Ok(Default::default()),
                start_msec: Ok(Default::default()),
                w: Err("no value supplied for w".to_string()),
                x: Err("no value supplied for x".to_string()),
                y: Err("no value supplied for y".to_string()),
                z_index: Ok(Default::default()),
            }
        }
    }
    impl SliderCard {
        pub fn card_type<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::string::String>,
            T::Error: ::std::fmt::Display,
        {
            self.card_type = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for card_type: {}", e));
            self
        }
        pub fn end_msec<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::option::Option<u64>>,
            T::Error: ::std::fmt::Display,
        {
            self.end_msec = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for end_msec: {}", e));
            self
        }
        pub fn h<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<super::NodekitInternalTypesCommonSpatialSize1>,
            T::Error: ::std::fmt::Display,
        {
            self.h = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for h: {}", e));
            self
        }
        pub fn initial_bin_index<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::option::Option<u64>>,
            T::Error: ::std::fmt::Display,
        {
            self.initial_bin_index = value.try_into().map_err(|e| {
                format!(
                    "error converting supplied value for initial_bin_index: {}",
                    e
                )
            });
            self
        }
        pub fn num_bins<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<i64>,
            T::Error: ::std::fmt::Display,
        {
            self.num_bins = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for num_bins: {}", e));
            self
        }
        pub fn orientation<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<super::Orientation>,
            T::Error: ::std::fmt::Display,
        {
            self.orientation = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for orientation: {}", e));
            self
        }
        pub fn show_bin_markers<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<bool>,
            T::Error: ::std::fmt::Display,
        {
            self.show_bin_markers = value.try_into().map_err(|e| {
                format!(
                    "error converting supplied value for show_bin_markers: {}",
                    e
                )
            });
            self
        }
        pub fn start_msec<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<u64>,
            T::Error: ::std::fmt::Display,
        {
            self.start_msec = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for start_msec: {}", e));
            self
        }
        pub fn w<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<super::NodekitInternalTypesCommonSpatialSize1>,
            T::Error: ::std::fmt::Display,
        {
            self.w = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for w: {}", e));
            self
        }
        pub fn x<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<super::SpatialPoint>,
            T::Error: ::std::fmt::Display,
        {
            self.x = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for x: {}", e));
            self
        }
        pub fn y<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<super::SpatialPoint>,
            T::Error: ::std::fmt::Display,
        {
            self.y = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for y: {}", e));
            self
        }
        pub fn z_index<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::option::Option<i64>>,
            T::Error: ::std::fmt::Display,
        {
            self.z_index = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for z_index: {}", e));
            self
        }
    }
    impl ::std::convert::TryFrom<SliderCard> for super::SliderCard {
        type Error = super::error::ConversionError;
        fn try_from(
            value: SliderCard,
        ) -> ::std::result::Result<Self, super::error::ConversionError> {
            Ok(Self {
                card_type: value.card_type?,
                end_msec: value.end_msec?,
                h: value.h?,
                initial_bin_index: value.initial_bin_index?,
                num_bins: value.num_bins?,
                orientation: value.orientation?,
                show_bin_markers: value.show_bin_markers?,
                start_msec: value.start_msec?,
                w: value.w?,
                x: value.x?,
                y: value.y?,
                z_index: value.z_index?,
            })
        }
    }
    impl ::std::convert::From<super::SliderCard> for SliderCard {
        fn from(value: super::SliderCard) -> Self {
            Self {
                card_type: Ok(value.card_type),
                end_msec: Ok(value.end_msec),
                h: Ok(value.h),
                initial_bin_index: Ok(value.initial_bin_index),
                num_bins: Ok(value.num_bins),
                orientation: Ok(value.orientation),
                show_bin_markers: Ok(value.show_bin_markers),
                start_msec: Ok(value.start_msec),
                w: Ok(value.w),
                x: Ok(value.x),
                y: Ok(value.y),
                z_index: Ok(value.z_index),
            }
        }
    }
    #[derive(Clone, Debug)]
    pub struct SubmitSensor {
        end_msec: ::std::result::Result<::std::option::Option<u64>, ::std::string::String>,
        sensor_type: ::std::result::Result<::std::string::String, ::std::string::String>,
        source_ids:
            ::std::result::Result<::std::vec::Vec<::std::string::String>, ::std::string::String>,
        start_msec: ::std::result::Result<u64, ::std::string::String>,
        submitter_id: ::std::result::Result<::std::string::String, ::std::string::String>,
    }
    impl ::std::default::Default for SubmitSensor {
        fn default() -> Self {
            Self {
                end_msec: Ok(Default::default()),
                sensor_type: Ok(super::defaults::submit_sensor_sensor_type()),
                source_ids: Err("no value supplied for source_ids".to_string()),
                start_msec: Ok(Default::default()),
                submitter_id: Err("no value supplied for submitter_id".to_string()),
            }
        }
    }
    impl SubmitSensor {
        pub fn end_msec<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::option::Option<u64>>,
            T::Error: ::std::fmt::Display,
        {
            self.end_msec = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for end_msec: {}", e));
            self
        }
        pub fn sensor_type<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::string::String>,
            T::Error: ::std::fmt::Display,
        {
            self.sensor_type = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for sensor_type: {}", e));
            self
        }
        pub fn source_ids<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::vec::Vec<::std::string::String>>,
            T::Error: ::std::fmt::Display,
        {
            self.source_ids = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for source_ids: {}", e));
            self
        }
        pub fn start_msec<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<u64>,
            T::Error: ::std::fmt::Display,
        {
            self.start_msec = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for start_msec: {}", e));
            self
        }
        pub fn submitter_id<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::string::String>,
            T::Error: ::std::fmt::Display,
        {
            self.submitter_id = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for submitter_id: {}", e));
            self
        }
    }
    impl ::std::convert::TryFrom<SubmitSensor> for super::SubmitSensor {
        type Error = super::error::ConversionError;
        fn try_from(
            value: SubmitSensor,
        ) -> ::std::result::Result<Self, super::error::ConversionError> {
            Ok(Self {
                end_msec: value.end_msec?,
                sensor_type: value.sensor_type?,
                source_ids: value.source_ids?,
                start_msec: value.start_msec?,
                submitter_id: value.submitter_id?,
            })
        }
    }
    impl ::std::convert::From<super::SubmitSensor> for SubmitSensor {
        fn from(value: super::SubmitSensor) -> Self {
            Self {
                end_msec: Ok(value.end_msec),
                sensor_type: Ok(value.sensor_type),
                source_ids: Ok(value.source_ids),
                start_msec: Ok(value.start_msec),
                submitter_id: Ok(value.submitter_id),
            }
        }
    }
    #[derive(Clone, Debug)]
    pub struct TextCard {
        background_color: ::std::result::Result<super::BackgroundColor, ::std::string::String>,
        card_type: ::std::result::Result<::std::string::String, ::std::string::String>,
        end_msec: ::std::result::Result<::std::option::Option<u64>, ::std::string::String>,
        font_size: ::std::result::Result<
            super::NodekitInternalTypesCommonSpatialSize1,
            ::std::string::String,
        >,
        h: ::std::result::Result<
            super::NodekitInternalTypesCommonSpatialSize1,
            ::std::string::String,
        >,
        justification_horizontal:
            ::std::result::Result<super::JustificationHorizontal, ::std::string::String>,
        justification_vertical:
            ::std::result::Result<super::JustificationVertical, ::std::string::String>,
        selectable: ::std::result::Result<bool, ::std::string::String>,
        start_msec: ::std::result::Result<u64, ::std::string::String>,
        text: ::std::result::Result<::std::string::String, ::std::string::String>,
        text_color: ::std::result::Result<super::TextColor, ::std::string::String>,
        w: ::std::result::Result<
            super::NodekitInternalTypesCommonSpatialSize1,
            ::std::string::String,
        >,
        x: ::std::result::Result<super::SpatialPoint, ::std::string::String>,
        y: ::std::result::Result<super::SpatialPoint, ::std::string::String>,
        z_index: ::std::result::Result<::std::option::Option<i64>, ::std::string::String>,
    }
    impl ::std::default::Default for TextCard {
        fn default() -> Self {
            Self {
                background_color: Ok(super::defaults::text_card_background_color()),
                card_type: Ok(super::defaults::text_card_card_type()),
                end_msec: Ok(Default::default()),
                font_size: Ok(super::defaults::text_card_font_size()),
                h: Err("no value supplied for h".to_string()),
                justification_horizontal: Ok(super::defaults::text_card_justification_horizontal()),
                justification_vertical: Ok(super::defaults::text_card_justification_vertical()),
                selectable: Ok(Default::default()),
                start_msec: Ok(Default::default()),
                text: Err("no value supplied for text".to_string()),
                text_color: Ok(super::defaults::text_card_text_color()),
                w: Err("no value supplied for w".to_string()),
                x: Err("no value supplied for x".to_string()),
                y: Err("no value supplied for y".to_string()),
                z_index: Ok(Default::default()),
            }
        }
    }
    impl TextCard {
        pub fn background_color<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<super::BackgroundColor>,
            T::Error: ::std::fmt::Display,
        {
            self.background_color = value.try_into().map_err(|e| {
                format!(
                    "error converting supplied value for background_color: {}",
                    e
                )
            });
            self
        }
        pub fn card_type<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::string::String>,
            T::Error: ::std::fmt::Display,
        {
            self.card_type = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for card_type: {}", e));
            self
        }
        pub fn end_msec<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::option::Option<u64>>,
            T::Error: ::std::fmt::Display,
        {
            self.end_msec = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for end_msec: {}", e));
            self
        }
        pub fn font_size<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<super::NodekitInternalTypesCommonSpatialSize1>,
            T::Error: ::std::fmt::Display,
        {
            self.font_size = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for font_size: {}", e));
            self
        }
        pub fn h<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<super::NodekitInternalTypesCommonSpatialSize1>,
            T::Error: ::std::fmt::Display,
        {
            self.h = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for h: {}", e));
            self
        }
        pub fn justification_horizontal<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<super::JustificationHorizontal>,
            T::Error: ::std::fmt::Display,
        {
            self.justification_horizontal = value.try_into().map_err(|e| {
                format!(
                    "error converting supplied value for justification_horizontal: {}",
                    e
                )
            });
            self
        }
        pub fn justification_vertical<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<super::JustificationVertical>,
            T::Error: ::std::fmt::Display,
        {
            self.justification_vertical = value.try_into().map_err(|e| {
                format!(
                    "error converting supplied value for justification_vertical: {}",
                    e
                )
            });
            self
        }
        pub fn selectable<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<bool>,
            T::Error: ::std::fmt::Display,
        {
            self.selectable = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for selectable: {}", e));
            self
        }
        pub fn start_msec<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<u64>,
            T::Error: ::std::fmt::Display,
        {
            self.start_msec = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for start_msec: {}", e));
            self
        }
        pub fn text<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::string::String>,
            T::Error: ::std::fmt::Display,
        {
            self.text = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for text: {}", e));
            self
        }
        pub fn text_color<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<super::TextColor>,
            T::Error: ::std::fmt::Display,
        {
            self.text_color = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for text_color: {}", e));
            self
        }
        pub fn w<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<super::NodekitInternalTypesCommonSpatialSize1>,
            T::Error: ::std::fmt::Display,
        {
            self.w = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for w: {}", e));
            self
        }
        pub fn x<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<super::SpatialPoint>,
            T::Error: ::std::fmt::Display,
        {
            self.x = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for x: {}", e));
            self
        }
        pub fn y<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<super::SpatialPoint>,
            T::Error: ::std::fmt::Display,
        {
            self.y = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for y: {}", e));
            self
        }
        pub fn z_index<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::option::Option<i64>>,
            T::Error: ::std::fmt::Display,
        {
            self.z_index = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for z_index: {}", e));
            self
        }
    }
    impl ::std::convert::TryFrom<TextCard> for super::TextCard {
        type Error = super::error::ConversionError;
        fn try_from(value: TextCard) -> ::std::result::Result<Self, super::error::ConversionError> {
            Ok(Self {
                background_color: value.background_color?,
                card_type: value.card_type?,
                end_msec: value.end_msec?,
                font_size: value.font_size?,
                h: value.h?,
                justification_horizontal: value.justification_horizontal?,
                justification_vertical: value.justification_vertical?,
                selectable: value.selectable?,
                start_msec: value.start_msec?,
                text: value.text?,
                text_color: value.text_color?,
                w: value.w?,
                x: value.x?,
                y: value.y?,
                z_index: value.z_index?,
            })
        }
    }
    impl ::std::convert::From<super::TextCard> for TextCard {
        fn from(value: super::TextCard) -> Self {
            Self {
                background_color: Ok(value.background_color),
                card_type: Ok(value.card_type),
                end_msec: Ok(value.end_msec),
                font_size: Ok(value.font_size),
                h: Ok(value.h),
                justification_horizontal: Ok(value.justification_horizontal),
                justification_vertical: Ok(value.justification_vertical),
                selectable: Ok(value.selectable),
                start_msec: Ok(value.start_msec),
                text: Ok(value.text),
                text_color: Ok(value.text_color),
                w: Ok(value.w),
                x: Ok(value.x),
                y: Ok(value.y),
                z_index: Ok(value.z_index),
            }
        }
    }
    #[derive(Clone, Debug)]
    pub struct TimeoutSensor {
        sensor_type: ::std::result::Result<::std::string::String, ::std::string::String>,
        timeout_msec: ::std::result::Result<::std::num::NonZeroU64, ::std::string::String>,
    }
    impl ::std::default::Default for TimeoutSensor {
        fn default() -> Self {
            Self {
                sensor_type: Ok(super::defaults::timeout_sensor_sensor_type()),
                timeout_msec: Err("no value supplied for timeout_msec".to_string()),
            }
        }
    }
    impl TimeoutSensor {
        pub fn sensor_type<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::string::String>,
            T::Error: ::std::fmt::Display,
        {
            self.sensor_type = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for sensor_type: {}", e));
            self
        }
        pub fn timeout_msec<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::num::NonZeroU64>,
            T::Error: ::std::fmt::Display,
        {
            self.timeout_msec = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for timeout_msec: {}", e));
            self
        }
    }
    impl ::std::convert::TryFrom<TimeoutSensor> for super::TimeoutSensor {
        type Error = super::error::ConversionError;
        fn try_from(
            value: TimeoutSensor,
        ) -> ::std::result::Result<Self, super::error::ConversionError> {
            Ok(Self {
                sensor_type: value.sensor_type?,
                timeout_msec: value.timeout_msec?,
            })
        }
    }
    impl ::std::convert::From<super::TimeoutSensor> for TimeoutSensor {
        fn from(value: super::TimeoutSensor) -> Self {
            Self {
                sensor_type: Ok(value.sensor_type),
                timeout_msec: Ok(value.timeout_msec),
            }
        }
    }
    #[derive(Clone, Debug)]
    pub struct Url {
        locator_type: ::std::result::Result<::std::string::String, ::std::string::String>,
        url: ::std::result::Result<::std::string::String, ::std::string::String>,
    }
    impl ::std::default::Default for Url {
        fn default() -> Self {
            Self {
                locator_type: Ok(super::defaults::url_locator_type()),
                url: Err("no value supplied for url".to_string()),
            }
        }
    }
    impl Url {
        pub fn locator_type<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::string::String>,
            T::Error: ::std::fmt::Display,
        {
            self.locator_type = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for locator_type: {}", e));
            self
        }
        pub fn url<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::string::String>,
            T::Error: ::std::fmt::Display,
        {
            self.url = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for url: {}", e));
            self
        }
    }
    impl ::std::convert::TryFrom<Url> for super::Url {
        type Error = super::error::ConversionError;
        fn try_from(value: Url) -> ::std::result::Result<Self, super::error::ConversionError> {
            Ok(Self {
                locator_type: value.locator_type?,
                url: value.url?,
            })
        }
    }
    impl ::std::convert::From<super::Url> for Url {
        fn from(value: super::Url) -> Self {
            Self {
                locator_type: Ok(value.locator_type),
                url: Ok(value.url),
            }
        }
    }
    #[derive(Clone, Debug)]
    pub struct Video {
        locator: ::std::result::Result<super::AssetLocator, ::std::string::String>,
        media_type: ::std::result::Result<super::VideoMediaType, ::std::string::String>,
        sha256: ::std::result::Result<super::Sha256, ::std::string::String>,
    }
    impl ::std::default::Default for Video {
        fn default() -> Self {
            Self {
                locator: Err("no value supplied for locator".to_string()),
                media_type: Err("no value supplied for media_type".to_string()),
                sha256: Err("no value supplied for sha256".to_string()),
            }
        }
    }
    impl Video {
        pub fn locator<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<super::AssetLocator>,
            T::Error: ::std::fmt::Display,
        {
            self.locator = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for locator: {}", e));
            self
        }
        pub fn media_type<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<super::VideoMediaType>,
            T::Error: ::std::fmt::Display,
        {
            self.media_type = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for media_type: {}", e));
            self
        }
        pub fn sha256<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<super::Sha256>,
            T::Error: ::std::fmt::Display,
        {
            self.sha256 = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for sha256: {}", e));
            self
        }
    }
    impl ::std::convert::TryFrom<Video> for super::Video {
        type Error = super::error::ConversionError;
        fn try_from(value: Video) -> ::std::result::Result<Self, super::error::ConversionError> {
            Ok(Self {
                locator: value.locator?,
                media_type: value.media_type?,
                sha256: value.sha256?,
            })
        }
    }
    impl ::std::convert::From<super::Video> for Video {
        fn from(value: super::Video) -> Self {
            Self {
                locator: Ok(value.locator),
                media_type: Ok(value.media_type),
                sha256: Ok(value.sha256),
            }
        }
    }
    #[derive(Clone, Debug)]
    pub struct VideoCard {
        card_type: ::std::result::Result<::std::string::String, ::std::string::String>,
        end_msec: ::std::result::Result<::std::option::Option<u64>, ::std::string::String>,
        h: ::std::result::Result<
            super::NodekitInternalTypesCommonSpatialSize1,
            ::std::string::String,
        >,
        loop_: ::std::result::Result<bool, ::std::string::String>,
        muted: ::std::result::Result<bool, ::std::string::String>,
        start: ::std::result::Result<bool, ::std::string::String>,
        start_msec: ::std::result::Result<u64, ::std::string::String>,
        video: ::std::result::Result<super::Video, ::std::string::String>,
        w: ::std::result::Result<
            super::NodekitInternalTypesCommonSpatialSize1,
            ::std::string::String,
        >,
        x: ::std::result::Result<super::SpatialPoint, ::std::string::String>,
        y: ::std::result::Result<super::SpatialPoint, ::std::string::String>,
        z_index: ::std::result::Result<::std::option::Option<i64>, ::std::string::String>,
    }
    impl ::std::default::Default for VideoCard {
        fn default() -> Self {
            Self {
                card_type: Ok(super::defaults::video_card_card_type()),
                end_msec: Ok(Default::default()),
                h: Err("no value supplied for h".to_string()),
                loop_: Ok(Default::default()),
                muted: Ok(super::defaults::default_bool::<true>()),
                start: Ok(super::defaults::default_bool::<true>()),
                start_msec: Ok(Default::default()),
                video: Err("no value supplied for video".to_string()),
                w: Err("no value supplied for w".to_string()),
                x: Err("no value supplied for x".to_string()),
                y: Err("no value supplied for y".to_string()),
                z_index: Ok(Default::default()),
            }
        }
    }
    impl VideoCard {
        pub fn card_type<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::string::String>,
            T::Error: ::std::fmt::Display,
        {
            self.card_type = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for card_type: {}", e));
            self
        }
        pub fn end_msec<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::option::Option<u64>>,
            T::Error: ::std::fmt::Display,
        {
            self.end_msec = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for end_msec: {}", e));
            self
        }
        pub fn h<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<super::NodekitInternalTypesCommonSpatialSize1>,
            T::Error: ::std::fmt::Display,
        {
            self.h = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for h: {}", e));
            self
        }
        pub fn loop_<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<bool>,
            T::Error: ::std::fmt::Display,
        {
            self.loop_ = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for loop_: {}", e));
            self
        }
        pub fn muted<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<bool>,
            T::Error: ::std::fmt::Display,
        {
            self.muted = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for muted: {}", e));
            self
        }
        pub fn start<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<bool>,
            T::Error: ::std::fmt::Display,
        {
            self.start = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for start: {}", e));
            self
        }
        pub fn start_msec<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<u64>,
            T::Error: ::std::fmt::Display,
        {
            self.start_msec = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for start_msec: {}", e));
            self
        }
        pub fn video<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<super::Video>,
            T::Error: ::std::fmt::Display,
        {
            self.video = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for video: {}", e));
            self
        }
        pub fn w<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<super::NodekitInternalTypesCommonSpatialSize1>,
            T::Error: ::std::fmt::Display,
        {
            self.w = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for w: {}", e));
            self
        }
        pub fn x<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<super::SpatialPoint>,
            T::Error: ::std::fmt::Display,
        {
            self.x = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for x: {}", e));
            self
        }
        pub fn y<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<super::SpatialPoint>,
            T::Error: ::std::fmt::Display,
        {
            self.y = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for y: {}", e));
            self
        }
        pub fn z_index<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::option::Option<i64>>,
            T::Error: ::std::fmt::Display,
        {
            self.z_index = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for z_index: {}", e));
            self
        }
    }
    impl ::std::convert::TryFrom<VideoCard> for super::VideoCard {
        type Error = super::error::ConversionError;
        fn try_from(
            value: VideoCard,
        ) -> ::std::result::Result<Self, super::error::ConversionError> {
            Ok(Self {
                card_type: value.card_type?,
                end_msec: value.end_msec?,
                h: value.h?,
                loop_: value.loop_?,
                muted: value.muted?,
                start: value.start?,
                start_msec: value.start_msec?,
                video: value.video?,
                w: value.w?,
                x: value.x?,
                y: value.y?,
                z_index: value.z_index?,
            })
        }
    }
    impl ::std::convert::From<super::VideoCard> for VideoCard {
        fn from(value: super::VideoCard) -> Self {
            Self {
                card_type: Ok(value.card_type),
                end_msec: Ok(value.end_msec),
                h: Ok(value.h),
                loop_: Ok(value.loop_),
                muted: Ok(value.muted),
                start: Ok(value.start),
                start_msec: Ok(value.start_msec),
                video: Ok(value.video),
                w: Ok(value.w),
                x: Ok(value.x),
                y: Ok(value.y),
                z_index: Ok(value.z_index),
            }
        }
    }
    #[derive(Clone, Debug)]
    pub struct ZipArchiveInnerPath {
        inner_path: ::std::result::Result<::std::string::String, ::std::string::String>,
        locator_type: ::std::result::Result<::std::string::String, ::std::string::String>,
        zip_archive_path: ::std::result::Result<::std::string::String, ::std::string::String>,
    }
    impl ::std::default::Default for ZipArchiveInnerPath {
        fn default() -> Self {
            Self {
                inner_path: Err("no value supplied for inner_path".to_string()),
                locator_type: Ok(super::defaults::zip_archive_inner_path_locator_type()),
                zip_archive_path: Err("no value supplied for zip_archive_path".to_string()),
            }
        }
    }
    impl ZipArchiveInnerPath {
        pub fn inner_path<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::string::String>,
            T::Error: ::std::fmt::Display,
        {
            self.inner_path = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for inner_path: {}", e));
            self
        }
        pub fn locator_type<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::string::String>,
            T::Error: ::std::fmt::Display,
        {
            self.locator_type = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for locator_type: {}", e));
            self
        }
        pub fn zip_archive_path<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::string::String>,
            T::Error: ::std::fmt::Display,
        {
            self.zip_archive_path = value.try_into().map_err(|e| {
                format!(
                    "error converting supplied value for zip_archive_path: {}",
                    e
                )
            });
            self
        }
    }
    impl ::std::convert::TryFrom<ZipArchiveInnerPath> for super::ZipArchiveInnerPath {
        type Error = super::error::ConversionError;
        fn try_from(
            value: ZipArchiveInnerPath,
        ) -> ::std::result::Result<Self, super::error::ConversionError> {
            Ok(Self {
                inner_path: value.inner_path?,
                locator_type: value.locator_type?,
                zip_archive_path: value.zip_archive_path?,
            })
        }
    }
    impl ::std::convert::From<super::ZipArchiveInnerPath> for ZipArchiveInnerPath {
        fn from(value: super::ZipArchiveInnerPath) -> Self {
            Self {
                inner_path: Ok(value.inner_path),
                locator_type: Ok(value.locator_type),
                zip_archive_path: Ok(value.zip_archive_path),
            }
        }
    }
}
#[doc = r" Generation of default values for serde."]
pub mod defaults {
    pub(super) fn default_bool<const V: bool>() -> bool {
        V
    }
    pub(super) fn default_i64<T, const V: i64>() -> T
    where
        T: ::std::convert::TryFrom<i64>,
        <T as ::std::convert::TryFrom<i64>>::Error: ::std::fmt::Debug,
    {
        T::try_from(V).unwrap()
    }
    pub(super) fn default_u64<T, const V: u64>() -> T
    where
        T: ::std::convert::TryFrom<u64>,
        <T as ::std::convert::TryFrom<u64>>::Error: ::std::fmt::Debug,
    {
        T::try_from(V).unwrap()
    }
    pub(super) fn click_sensor_mask() -> super::Mask {
        super::Mask::Rectangle
    }
    pub(super) fn click_sensor_sensor_type() -> ::std::string::String {
        "ClickSensor".to_string()
    }
    pub(super) fn file_system_path_locator_type() -> ::std::string::String {
        "FileSystemPath".to_string()
    }
    pub(super) fn free_text_entry_card_background_color() -> super::BackgroundColor {
        super::BackgroundColor("#ffffff".to_string())
    }
    pub(super) fn free_text_entry_card_card_type() -> ::std::string::String {
        "FreeTextEntryCard".to_string()
    }
    pub(super) fn free_text_entry_card_font_size() -> super::NodekitInternalTypesCommonSpatialSize1
    {
        super::NodekitInternalTypesCommonSpatialSize1(0.02_f64)
    }
    pub(super) fn free_text_entry_card_text_color() -> super::TextColor {
        super::TextColor("#000000".to_string())
    }
    pub(super) fn graph_nodekit_version() -> ::std::string::String {
        "0.1.0".to_string()
    }
    pub(super) fn hide_pointer_effect_effect_type() -> ::std::string::String {
        "HidePointerEffect".to_string()
    }
    pub(super) fn image_card_card_type() -> ::std::string::String {
        "ImageCard".to_string()
    }
    pub(super) fn key_sensor_sensor_type() -> ::std::string::String {
        "KeySensor".to_string()
    }
    pub(super) fn node_annotation() -> super::JsonValue {
        super::JsonValue::Null
    }
    pub(super) fn node_board_color() -> super::BoardColor {
        super::BoardColor("#808080ff".to_string())
    }
    pub(super) fn relative_path_locator_type() -> ::std::string::String {
        "RelativePath".to_string()
    }
    pub(super) fn slider_card_card_type() -> ::std::string::String {
        "SliderCard".to_string()
    }
    pub(super) fn slider_card_orientation() -> super::Orientation {
        super::Orientation::Horizontal
    }
    pub(super) fn submit_sensor_sensor_type() -> ::std::string::String {
        "SubmitSensor".to_string()
    }
    pub(super) fn text_card_background_color() -> super::BackgroundColor {
        super::BackgroundColor("#E6E6E600".to_string())
    }
    pub(super) fn text_card_card_type() -> ::std::string::String {
        "TextCard".to_string()
    }
    pub(super) fn text_card_font_size() -> super::NodekitInternalTypesCommonSpatialSize1 {
        super::NodekitInternalTypesCommonSpatialSize1(0.02_f64)
    }
    pub(super) fn text_card_justification_horizontal() -> super::JustificationHorizontal {
        super::JustificationHorizontal::Center
    }
    pub(super) fn text_card_justification_vertical() -> super::JustificationVertical {
        super::JustificationVertical::Center
    }
    pub(super) fn text_card_text_color() -> super::TextColor {
        super::TextColor("#000000".to_string())
    }
    pub(super) fn timeout_sensor_sensor_type() -> ::std::string::String {
        "TimeoutSensor".to_string()
    }
    pub(super) fn url_locator_type() -> ::std::string::String {
        "URL".to_string()
    }
    pub(super) fn video_card_card_type() -> ::std::string::String {
        "VideoCard".to_string()
    }
    pub(super) fn zip_archive_inner_path_locator_type() -> ::std::string::String {
        "ZipArchiveInnerPath".to_string()
    }
}