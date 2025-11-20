export interface Database {
  public: {
    Tables: {
        users: {
            Row: {
                id: string;
                name: string;
                email: string;
                created_at: string;
            };
    
            Insert: Omit<
                Database['public']['Tables']['users']['Row'], 'id' | 'created_at'
            >;
    
            Update: Partial<
                Database['public']['Tables']['users']['Insert']
            >;
        }
    };
  };
}
