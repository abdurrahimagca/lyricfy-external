export interface Tops {
  href: string;
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
  items: Array<{
    album: {
      album_type: string;
      total_tracks: number;
      available_markets: string[];
      href: string;
      id: string;
      images: Array<
        { url: string; height: number | null; width: number | null }
      >;
      name: string;
      release_date: string;
      release_date_precision: string;
      type: string;
      uri: string;
      artists: Array<{
        href: string;
        id: string;
        name: string;
        type: string;
        uri: string;
      }>;
    };
    artists: Array<{
      href: string;
      id: string;
      name: string;
      type: string;
      uri: string;
    }>;
    available_markets: string[];
    disc_number: number;
    duration_ms: number;
    explicit: boolean;
    href: string;
    id: string;
    is_playable: boolean;
    name: string;
    popularity: number;
    preview_url: string | null;
    track_number: number;
    type: string;
    uri: string;
    is_local: boolean;
    external_ids: { isrc: string };
  }>;
};
