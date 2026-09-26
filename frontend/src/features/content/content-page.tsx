import React, { useState } from "react";
import { Page } from "@/components/layout/page";
import { SecondaryPage } from "@/features/platform/secondary-page";
import { Images } from "lucide-react";
import { INITIAL_SCHEDULED_POSTS, ScheduledPostItem } from "@/data/posts-analytics";
import { PostSchedulerTab } from "@/components/posts/post-scheduler-tab";
import { CreatePostUpdateView } from "@/components/posts/create-post-update-view";
import { CreateOfferView } from "@/components/posts/create-offer-view";
import { CreateEventView } from "@/components/posts/create-event-view";
import { EditSelectionModal } from "@/components/posts/edit-selection-modal";
import { PhotosManagerTab } from "@/components/content/photos-manager-tab";

export type ContentSubTab = "posts" | "photos";
export type PostsViewMode = "scheduler" | "create-update" | "create-offer" | "create-event";

export function ContentPage({ initialTab = "posts" }: { initialTab?: ContentSubTab }) {
  const [activeTab, setActiveTab] = useState<ContentSubTab>(initialTab);
  const [postsViewMode, setPostsViewMode] = useState<PostsViewMode>("scheduler");
  const [postsList, setPostsList] = useState<ScheduledPostItem[]>(INITIAL_SCHEDULED_POSTS);

  // Edit selection modal state
  const [editSelectionOpen, setEditSelectionOpen] = useState(false);
  const [selectedListingsCount, setSelectedListingsCount] = useState(315);
  const [selectedMode, setSelectedMode] = useState<"tags" | "store_code">("tags");
  const [selectedFilterItems, setSelectedFilterItems] = useState<string[]>([]);

  const handleCreateNew = (type: "update" | "offer" | "event") => {
    if (type === "update") setPostsViewMode("create-update");
    if (type === "offer") setPostsViewMode("create-offer");
    if (type === "event") setPostsViewMode("create-event");
  };

  const handlePostNow = (postData: any) => {
    const newPost: ScheduledPostItem = {
      id: `post-${Date.now()}`,
      title: postData.name || postData.offerTitle || postData.eventTitle || "New Post",
      type: postData.type,
      status: postData.scheduleLater ? "Upcoming" : "Posted",
      date: postData.scheduleLater ? postData.scheduleDate : "2026-09-18",
      dayNumber: postData.scheduleLater ? parseInt(postData.scheduleDate.split("-")[2], 10) : 18,
      platforms: postData.googleSelected && postData.facebookSelected
        ? ["Google", "Facebook"]
        : postData.googleSelected
        ? ["Google"]
        : ["Facebook"],
      listingsCount: selectedListingsCount,
      description: postData.description,
    };

    setPostsList([newPost, ...postsList]);
    setPostsViewMode("scheduler");
  };

  const handleSaveSelection = (mode: "tags" | "store_code", items: string[]) => {
    setSelectedMode(mode);
    setSelectedFilterItems(items);
    if (items.length > 0) {
      setSelectedListingsCount(items.length * 45); // Dynamic calculation based on selection
    } else {
      setSelectedListingsCount(315);
    }
  };

  return (
    <Page>
      {/* Top Sub-Nav Bar - Only rendered when on main list/scheduler view */}
      {postsViewMode === "scheduler" && (
        <div className="border-b border-border bg-background -mx-4 -mt-4 px-4 sm:-mx-6 sm:-mt-6 sm:px-6 mb-6">
          <nav className="flex items-center gap-6 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab("posts")}
              className={`py-3 text-xs font-semibold whitespace-nowrap transition-all border-b-2 cursor-pointer ${
                activeTab === "posts"
                  ? "border-blue-500 text-blue-500 font-bold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Posts
            </button>
            <button
              onClick={() => setActiveTab("photos")}
              className={`py-3 text-xs font-semibold whitespace-nowrap transition-all border-b-2 cursor-pointer ${
                activeTab === "photos"
                  ? "border-blue-500 text-blue-500 font-bold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Photos
            </button>
          </nav>
        </div>
      )}

      {/* Render Active Tab Content */}
      {activeTab === "posts" && (
        <>
          {postsViewMode === "scheduler" && (
            <PostSchedulerTab
              onCreateNew={handleCreateNew}
              posts={postsList}
            />
          )}

          {postsViewMode === "create-update" && (
            <CreatePostUpdateView
              onBack={() => setPostsViewMode("scheduler")}
              onPostNow={handlePostNow}
              onOpenEditSelection={() => setEditSelectionOpen(true)}
              selectedListingsCount={selectedListingsCount}
            />
          )}

          {postsViewMode === "create-offer" && (
            <CreateOfferView
              onBack={() => setPostsViewMode("scheduler")}
              onPostNow={handlePostNow}
              onOpenEditSelection={() => setEditSelectionOpen(true)}
              selectedListingsCount={selectedListingsCount}
            />
          )}

          {postsViewMode === "create-event" && (
            <CreateEventView
              onBack={() => setPostsViewMode("scheduler")}
              onPostNow={handlePostNow}
              onOpenEditSelection={() => setEditSelectionOpen(true)}
              selectedListingsCount={selectedListingsCount}
            />
          )}
        </>
      )}

      {activeTab === "photos" && <PhotosManagerTab />}

      {/* Edit Selection Modal */}
      <EditSelectionModal
        open={editSelectionOpen}
        onClose={() => setEditSelectionOpen(false)}
        onSave={handleSaveSelection}
        initialMode={selectedMode}
        initialSelected={selectedFilterItems}
      />
    </Page>
  );
}
