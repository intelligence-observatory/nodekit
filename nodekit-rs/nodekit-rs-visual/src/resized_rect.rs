use nodekit_rs_models::Rect;

pub struct ResizedRect {
    pub rect: Rect,
    pub width: u32,
    pub height: u32,
}

impl ResizedRect {
    pub fn new(rect: &Rect, width: u32, height: u32) -> Self {
        let (w, h) = if rect.size.w < rect.size.h {
            (rect.size.w, rect.size.h)
        } else if rect.size.w > rect.size.h {
            (rect.size.w, rect.size.w * rect.size.w / rect.size.h)
        } else {
            (rect.size.h, rect.size.h * rect.size.h / rect.size.w)
        };
        let mut rect = *rect;
        if w < rect.size.w {
            rect.position.x += rect.size.w / 2. - w / 2.;
        }
        if h < rect.size.h {
            rect.position.y += rect.size.h / 2. - h / 2.;
        }
        rect.size.w = w;
        rect.size.h = h;
        Self {
            rect,
            width,
            height,
        }
    }
}
