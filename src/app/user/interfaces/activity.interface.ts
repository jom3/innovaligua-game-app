export interface Activity {
  id:         string;
  userId:     string;
  type:       string;
  max_score:  number;
  attempts:   number;
  state:      number;
  created_at: Date;
  ended_at?:   Date;
}
