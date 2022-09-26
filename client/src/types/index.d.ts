export {}

declare global {
  interface Window {
    vex_jwt: string
    vex_room_id: string
  }
}