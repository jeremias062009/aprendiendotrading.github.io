import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, Layers } from "lucide-react";

interface EBook {
  id: string;
  title: string;
  description: string;
  chapters: number;
  duration: string;
  category: string;
  imageUrl?: string;
  isPublished: boolean;
}

interface EBookCardProps {
  ebook: EBook;
}

export default function EBookCard({ ebook }: EBookCardProps) {
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'basics':
      case 'básico':
        return 'bg-chart-1';
      case 'intermediate':
      case 'intermedio':
        return 'bg-chart-3';
      case 'advanced':
      case 'avanzado':
        return 'bg-chart-2';
      default:
        return 'bg-muted-foreground';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category.toLowerCase()) {
      case 'basics':
        return 'Básico';
      case 'intermediate':
        return 'Intermedio';
      case 'advanced':
        return 'Avanzado';
      default:
        return category;
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow animate-slide-in group" data-testid={`ebook-card-${ebook.id}`}>
      {/* Image or placeholder */}
      <div className="h-48 bg-gradient-to-br from-primary/20 to-chart-1/20 flex items-center justify-center relative overflow-hidden">
        {ebook.imageUrl ? (
          <img 
            src={ebook.imageUrl} 
            alt={ebook.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex flex-col items-center">
            <BookOpen className="w-16 h-16 text-primary mb-2" />
            <Badge className={`${getCategoryColor(ebook.category)} text-white`}>
              {getCategoryLabel(ebook.category)}
            </Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold line-clamp-2 flex-1" data-testid={`ebook-title-${ebook.id}`}>
            {ebook.title}
          </h3>
        </div>
        
        <p className="text-muted-foreground mb-4 line-clamp-3" data-testid={`ebook-description-${ebook.id}`}>
          {ebook.description}
        </p>
        
        <div className="flex items-center justify-between mb-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Layers className="w-4 h-4" />
            <span data-testid={`ebook-chapters-${ebook.id}`}>
              {ebook.chapters} capítulos
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span data-testid={`ebook-duration-${ebook.id}`}>
              {ebook.duration}
            </span>
          </div>
        </div>
        
        <Button 
          className="w-full group-hover:bg-primary/90 transition-colors" 
          data-testid={`button-read-ebook-${ebook.id}`}
        >
          Leer Ahora - Gratis
        </Button>
      </CardContent>
    </Card>
  );
}
