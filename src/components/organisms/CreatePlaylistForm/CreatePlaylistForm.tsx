"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, Users } from "lucide-react";
import {
  Button,
  TextField,
  InputGroup,
  FieldError,
  SwitchRoot,
  SwitchControl,
  SwitchThumb,
  SwitchContent,
} from "@heroui/react";
import { createPlaylist } from "@/actions/playlists";
import { createPlaylistSchema, type CreatePlaylistInput } from "@/lib/schemas/playlist";
import type { Playlist } from "@/types/playlist";

type FormValues = CreatePlaylistInput;

interface CreatePlaylistFormProps {
  onSuccess?: (playlist: Playlist) => void;
  onCancel?: () => void;
}

export function CreatePlaylistForm({ onSuccess, onCancel }: CreatePlaylistFormProps) {
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(createPlaylistSchema),
    defaultValues: { is_public: false, is_collaborative: false },
  });

  async function onSubmit(values: FormValues) {
    setApiError(null);
    const res = await createPlaylist(values);
    if (!res.ok) {
      setApiError(res.error);
      return;
    }
    reset();
    onSuccess?.(res.data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
      <TextField isInvalid={!!errors.name}>
        <label className="text-[13px] font-semibold text-ink mb-1 block">Nombre</label>
        <InputGroup>
          <InputGroup.Input
            placeholder="Ej. Misa de Pentecostés"
            autoComplete="off"
            {...register("name")}
          />
        </InputGroup>
        <FieldError>{errors.name?.message}</FieldError>
      </TextField>

      <TextField>
        <label className="text-[13px] font-semibold text-ink mb-1 block">Descripción</label>
        <InputGroup>
          <InputGroup.TextArea
            placeholder="¿Para qué celebración es esta lista?"
            rows={3}
            {...register("description")}
          />
        </InputGroup>
      </TextField>

      <div className="flex flex-col gap-3">
        <Controller
          name="is_public"
          control={control}
          render={({ field }) => (
            <div className="flex items-center justify-between gap-3 py-3 border-b border-line">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-paper-2 flex items-center justify-center shrink-0">
                  <Eye size={16} className="text-muted" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-[14px] font-semibold text-ink">Lista pública</p>
                  <p className="text-[12px] text-muted">Visible para toda la comunidad.</p>
                </div>
              </div>
              <SwitchRoot
                isSelected={field.value}
                onChange={field.onChange}
                aria-label="Lista pública"
              >
                <SwitchControl>
                  <SwitchThumb />
                </SwitchControl>
              </SwitchRoot>
            </div>
          )}
        />

        <Controller
          name="is_collaborative"
          control={control}
          render={({ field }) => (
            <div className="flex items-center justify-between gap-3 py-3">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-paper-2 flex items-center justify-center shrink-0">
                  <Users size={16} className="text-muted" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-[14px] font-semibold text-ink">Colaborativa</p>
                  <p className="text-[12px] text-muted">Otros pueden agregar cantos.</p>
                </div>
              </div>
              <SwitchRoot
                isSelected={field.value}
                onChange={field.onChange}
                aria-label="Colaborativa"
              >
                <SwitchControl>
                  <SwitchThumb />
                </SwitchControl>
              </SwitchRoot>
            </div>
          )}
        />
      </div>

      {apiError && (
        <p role="alert" className="text-[13px] text-danger text-center">
          {apiError}
        </p>
      )}

      <div className="flex gap-3 pt-1">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onPress={onCancel}
            className="flex-1 font-semibold"
          >
            Cancelar
          </Button>
        )}
        <Button
          type="submit"
          isDisabled={isSubmitting}
          className="flex-1 font-bold bg-orange text-white"
        >
          {isSubmitting ? "Creando…" : "Crear lista"}
        </Button>
      </div>
    </form>
  );
}
