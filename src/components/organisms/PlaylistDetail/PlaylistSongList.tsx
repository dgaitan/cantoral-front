"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { PlaylistSongRow } from "@/components/molecules/PlaylistSongRow/PlaylistSongRow";
import { reorderSongs, attachSongs } from "@/actions/playlists";
import type { PlaylistSong } from "@/types/playlist";

interface SortableRowProps {
  item: PlaylistSong;
  index: number;
  canManage: boolean;
  onRemove: (songId: number) => void;
}

function SortableRow({ item, index, canManage, onRemove }: SortableRowProps) {
  const { setNodeRef, setActivatorNodeRef, listeners, transform, transition, isDragging } =
    useSortable({ id: item.song.id, disabled: !canManage });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={isDragging ? "opacity-50" : undefined}
    >
      <PlaylistSongRow
        song={item.song}
        order={index + 1}
        isDraggable={canManage}
        dragHandleProps={listeners as React.HTMLAttributes<HTMLElement>}
        dragHandleRef={setActivatorNodeRef as React.Ref<HTMLElement>}
        onRemove={canManage ? () => onRemove(Number(item.song.id)) : undefined}
      />
    </div>
  );
}

interface PlaylistSongListProps {
  playlistUuid: string;
  initialSongs: PlaylistSong[];
  canManage: boolean;
}

export function PlaylistSongList({ playlistUuid, initialSongs, canManage }: PlaylistSongListProps) {
  const [songs, setSongs] = useState(initialSongs);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragStart({ active }: DragStartEvent) {
    setActiveId(String(active.id));
  }

  async function handleDragEnd({ active, over }: DragEndEvent) {
    setActiveId(null);
    if (!over || active.id === over.id) return;

    const oldIndex = songs.findIndex((s) => s.song.id === String(active.id));
    const newIndex = songs.findIndex((s) => s.song.id === String(over.id));
    const reordered = arrayMove(songs, oldIndex, newIndex);
    setSongs(reordered);

    await reorderSongs(
      playlistUuid,
      reordered.map((s) => Number(s.song.id))
    );
  }

  async function handleRemove(songId: number) {
    await attachSongs(playlistUuid, [songId]);
    setSongs((prev) => prev.filter((s) => Number(s.song.id) !== songId));
  }

  const activeItem = activeId ? songs.find((s) => s.song.id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={songs.map((s) => s.song.id)} strategy={verticalListSortingStrategy}>
        {songs.map((item, index) => (
          <SortableRow
            key={item.song.id}
            item={item}
            index={index}
            canManage={canManage}
            onRemove={handleRemove}
          />
        ))}
      </SortableContext>

      <DragOverlay>
        {activeItem && (
          <PlaylistSongRow
            song={activeItem.song}
            order={songs.findIndex((s) => s.song.id === activeId) + 1}
            isDraggable={false}
            className="bg-white rounded-xl shadow-lg"
          />
        )}
      </DragOverlay>
    </DndContext>
  );
}
