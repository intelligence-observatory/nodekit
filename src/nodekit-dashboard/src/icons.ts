import refreshCw from "lucide-static/icons/refresh-cw.svg?raw";
import search from "lucide-static/icons/search.svg?raw";

const icons = {
  refreshCw,
  search,
};

export type IconName = keyof typeof icons;

export function icon(name: IconName): string {
  return icons[name].replace("<svg", '<svg aria-hidden="true" focusable="false"');
}
