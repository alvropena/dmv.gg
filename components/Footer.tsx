import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ThemeToggle"
import { TikTokIcon } from "@/components/icons/TikTokIcon"
import { InstagramIcon } from "@/components/icons/InstagramIcon"
import { YouTubeIcon } from "@/components/icons/YouTubeIcon"

export function Footer() {
  return (
    <footer className="w-full border-t">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Excellence LatAm. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" asChild>
                <a
                  href="https://tiktok.com/@dmvgg"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <TikTokIcon className="h-4 w-4 fill-current" />
                  <span className="sr-only">TikTok</span>
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a
                  href="https://instagram.com/dmvgg"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <InstagramIcon className="h-4 w-4 fill-current" />
                  <span className="sr-only">Instagram</span>
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a
                  href="https://youtube.com/@dmvgg"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <YouTubeIcon className="h-4 w-4 fill-current" />
                  <span className="sr-only">YouTube</span>
                </a>
              </Button>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </footer>
  )
} 