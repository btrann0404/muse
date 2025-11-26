export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          email: string;
          username: string;
          created_at: string;
        };

        Insert: Omit<
          Database["public"]["Tables"]["users"]["Row"],
          "id" | "created_at"
        >;

        Update: Partial<Database["public"]["Tables"]["users"]["Insert"]>;
      };
      sessions: {
        Row: {
          id: string;
          userid: string;
          title: string;
          description: string;
          duration: string;
          location: string;
          date: string;
          created_at: string;
        };

        Insert: Omit<
          Database["public"]["Tables"]["sessions"]["Row"],
          "id" | "created_at"
        >;

        Update: Partial<Database["public"]["Tables"]["users"]["Insert"]>;
      };
      photos: {
        Row: {
          id: string;
          sessionId: string;
          url: string;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["photos"]["Row"],
          "id" | "created_at"
        >;

        Update: Partial<Database["public"]["Tables"]["users"]["Insert"]>;
      };
      friendships: {
        Row: {
          id: string;
          userid: string;
          friendid: string;
          status: string;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["friendships"]["Row"],
          "id" | "created_at"
        >;

        Update: Partial<Database["public"]["Tables"]["users"]["Insert"]>;
      };
    };
  };
}
