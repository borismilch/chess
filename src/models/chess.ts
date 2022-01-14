import { PieceType } from "chess.js";

export interface IChessBoardPiece {
  type: PieceType,
  color: "b" | "w"
}