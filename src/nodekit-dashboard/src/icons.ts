import chartLine from "lucide-static/icons/chart-line.svg?raw";
import copy from "lucide-static/icons/copy.svg?raw";
import download from "lucide-static/icons/download.svg?raw";
import externalLink from "lucide-static/icons/external-link.svg?raw";
import refreshCw from "lucide-static/icons/refresh-cw.svg?raw";
import search from "lucide-static/icons/search.svg?raw";
import x from "lucide-static/icons/x.svg?raw";

const icons = {
  chartLine,
  copy,
  download,
  externalLink,
  refreshCw,
  search,
  x,
};

export type IconName = keyof typeof icons;

export function icon(name: IconName): string {
  return icons[name].replace("<svg", '<svg aria-hidden="true" focusable="false"');
}
