import { Link } from "wouter";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FloatingActionButton() {
  return (
    <Link href="/">
      <Button
        size="icon"
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-pure-white text-black shadow-lg hover:shadow-xl hover:bg-pure-white/90 transition-all active:scale-95"
      >
        <Plus className="h-6 w-6" />
      </Button>
    </Link>
  );
}
