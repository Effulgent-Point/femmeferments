export const GLASS_PIECES = [
  { file: "01_left_outer_teal_points_tight.png", cx: 18.5, cy: 37.2, left: 5.32, top: 19.0, w: 26.35, h: 36.4, pw: 336, ph: 344 },
  { file: "02_left_top_teal_shards_tight.png", cx: 26.5, cy: 25.4, left: 14.85, top: 14.92, w: 23.29, h: 20.95, pw: 297, ph: 198 },
  { file: "03_left_mid_blue_green_tight.png", cx: 26.6, cy: 44.8, left: 19.7, top: 37.5, w: 13.8, h: 14.6, pw: 176, ph: 138 },
  { file: "04_left_lower_green_blue_tight.png", cx: 26.2, cy: 59.5, left: 7.02, top: 46.11, w: 38.35, h: 26.77, pw: 489, ph: 253 },
  { file: "05_lower_left_blue_tail_tight.png", cx: 27.6, cy: 75.0, left: 13.44, top: 64.79, w: 28.31, h: 20.42, pw: 361, ph: 193 },
  { file: "06_upper_mid_green_crown_tight.png", cx: 38.7, cy: 33.3, left: 31.52, top: 19.76, w: 14.35, h: 27.09, pw: 183, ph: 256 },
  { file: "07_mid_left_green_bridge_tight.png", cx: 38.3, cy: 49.7, left: 29.01, top: 40.71, w: 18.59, h: 17.99, pw: 237, ph: 170 },
  { file: "08_center_core_burst_tight.png", cx: 47.2, cy: 36.7, left: 37.51, top: 12.63, w: 19.37, h: 48.15, pw: 247, ph: 455 },
  { file: "09_lower_center_cyan_blue_tight.png", cx: 47.8, cy: 70.0, left: 36.9, top: 55.4, w: 21.8, h: 29.21, pw: 278, ph: 276 },
  { file: "10_upper_yellow_orange_tight.png", cx: 58.5, cy: 26.6, left: 45.25, top: 11.73, w: 26.51, h: 29.74, pw: 338, ph: 281 },
  { file: "11_right_upper_pink_orange_tight.png", cx: 68.9, cy: 31.7, left: 60.55, top: 20.38, w: 16.71, h: 22.65, pw: 213, ph: 214 },
  { file: "12_upper_right_purple_sail_tight.png", cx: 78.8, cy: 24.8, left: 71.66, top: 13.9, w: 14.27, h: 21.8, pw: 182, ph: 206 },
  { file: "13_right_mid_teal_glass_tight.png", cx: 67.3, cy: 44.7, left: 56.79, top: 33.69, w: 21.02, h: 22.01, pw: 268, ph: 208 },
  { file: "14_right_warm_red_orange_tight.png", cx: 82.5, cy: 43.0, left: 69.68, top: 25.06, w: 25.65, h: 35.87, pw: 327, ph: 339 },
  { file: "15_right_lower_blue_purple_tight.png", cx: 65.5, cy: 61.4, left: 50.95, top: 40.29, w: 29.1, h: 42.22, pw: 371, ph: 399 },
  { file: "16_far_right_red_tail_tight.png", cx: 87.7, cy: 56.7, left: 79.07, top: 47.92, w: 17.25, h: 17.57, pw: 220, ph: 166 },
  { file: "17_lower_right_purple_tail_tight.png", cx: 82.0, cy: 70.2, left: 71.02, top: 57.34, w: 21.96, h: 25.71, pw: 280, ph: 243 },
  { file: "18_bottom_center_teal_splinters_tight.png", cx: 59.0, cy: 75.4, left: 50.1, top: 62.38, w: 17.8, h: 26.03, pw: 227, ph: 246 },
] as const;

export type GlassPiece = (typeof GLASS_PIECES)[number];

export const CENTER_PIECE_FILES = new Set([
  "06_upper_mid_green_crown_tight.png",
  "07_mid_left_green_bridge_tight.png",
  "08_center_core_burst_tight.png",
  "10_upper_yellow_orange_tight.png",
  "13_right_mid_teal_glass_tight.png",
]);
