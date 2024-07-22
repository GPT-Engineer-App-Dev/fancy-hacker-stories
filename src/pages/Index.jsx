import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink } from "lucide-react";

const fetchTopStories = async () => {
  const response = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json");
  const storyIds = await response.json();
  return Promise.all(storyIds.slice(0, 100).map(fetchStory));
};

const fetchStory = async (id) => {
  const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
  return response.json();
};

const StoryItem = ({ story }) => (
  <Card className="mb-4 hover:shadow-md transition-shadow">
    <CardHeader>
      <CardTitle className="text-lg">
        <a href={story.url} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center">
          {story.title}
          <ExternalLink className="ml-2 h-4 w-4" />
        </a>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-muted-foreground">
        By {story.by} | Score: {story.score}
      </p>
    </CardContent>
  </Card>
);

const Index = () => {
  const { data: stories, isLoading, error } = useQuery({
    queryKey: ['topStories'],
    queryFn: fetchTopStories
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Top Hacker News Stories</h1>
        {[...Array(10)].map((_, index) => (
          <Card key={index} className="mb-4">
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Top Hacker News Stories</h1>
        <Card className="bg-red-100 text-red-800">
          <CardContent>
            <p>Error loading stories. Please try again later.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Top Hacker News Stories</h1>
      {stories.map((story) => (
        <StoryItem key={story.id} story={story} />
      ))}
    </div>
  );
};

export default Index;