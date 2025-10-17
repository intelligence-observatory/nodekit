pub struct Timer {
    pub t0: u32,
    pub t1: Option<u32>,
}

impl<'c> From<&nodekit_rs_fb::Card<'c>> for Timer {
    fn from(value: &nodekit_rs_fb::Card<'c>) -> Self {
        let t0 = value.start_msec().unsigned_abs();
        let t1 = value.end_msec().map(|v| v.unsigned_abs());
        Self { t0, t1 }
    }
}
