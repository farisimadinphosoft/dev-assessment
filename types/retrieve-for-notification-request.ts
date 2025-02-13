export interface RetrieveForNotificationsRequest {
  teacher: string;
  notification: string;
}

export interface RetrieveForNotificationsResponse {
  recipients: string[];
}