import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Video, ExternalLink, Play } from "lucide-react";

interface Tutorial {
  id: string;
  title: string;
  description: string;
  platform: string;
  videoUrl?: string;
  imageUrl?: string;
  isPublished: boolean;
}

interface TutorialCardProps {
  tutorial: Tutorial;
}

export default function TutorialCard({ tutorial }: TutorialCardProps) {
  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'binance':
        return 'bg-yellow-500';
      case 'bingx':
        return 'bg-blue-500';
      default:
        return 'bg-muted-foreground';
    }
  };

  const getPlatformName = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'binance':
        return 'Binance';
      case 'bingx':
        return 'BingX';
      default:
        return platform;
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow animate-slide-in group" data-testid={`tutorial-card-${tutorial.id}`}>
      {/* Image or placeholder */}
      <div className="h-48 bg-gradient-to-br from-primary/20 to-chart-1/20 flex items-center justify-center relative overflow-hidden">
        {tutorial.imageUrl ? (
          <>
            <img 
              src={tutorial.imageUrl} 
              alt={tutorial.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {tutorial.videoUrl && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Play className="w-8 h-8 text-white ml-1" />
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center">
            <Video className="w-16 h-16 text-primary mb-2" />
            <Badge className={`${getPlatformColor(tutorial.platform)} text-white`}>
              {getPlatformName(tutorial.platform)}
            </Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold line-clamp-2 flex-1" data-testid={`tutorial-title-${tutorial.id}`}>
            {tutorial.title}
          </h3>
          <Badge 
            variant="outline" 
            className={`ml-2 ${getPlatformColor(tutorial.platform)} text-white border-0`}
          >
            {getPlatformName(tutorial.platform)}
          </Badge>
        </div>
        
        <p className="text-muted-foreground mb-6 line-clamp-3" data-testid={`tutorial-description-${tutorial.id}`}>
          {tutorial.description}
        </p>
        
        <div className="flex gap-2">
          <Button 
            className="flex-1 group-hover:bg-primary/90 transition-colors" 
            data-testid={`button-view-tutorial-${tutorial.id}`}
          >
            <Video className="w-4 h-4 mr-2" />
            Ver Tutorial
          </Button>
          {tutorial.videoUrl && (
            <Button 
              variant="outline" 
              size="icon"
              asChild
              data-testid={`button-external-tutorial-${tutorial.id}`}
            >
              <a href={tutorial.videoUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
