import { ThemeToggle } from "@/components/ThemeToggle";
import { TikTokIcon } from "@/components/icons/TikTokIcon";
import { InstagramIcon } from "@/components/icons/InstagramIcon";
import { YouTubeIcon } from "@/components/icons/YouTubeIcon";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Excellence LatAm.
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="https://instagram.com/dmvgg"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <InstagramIcon className="h-4 w-4 fill-current" />
              <span className="sr-only">Instagram</span>
            </Link>
            <Link
              href="https://tiktok.com/@dmvgg"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <TikTokIcon className="h-4 w-4 fill-current" />
              <span className="sr-only">TikTok</span>
            </Link>
            <Link
              href="https://youtube.com/@dmvgg"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <YouTubeIcon className="h-4 w-4 fill-current" />
              <span className="sr-only">YouTube</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
