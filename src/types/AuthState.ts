import { Usuario } from "./Usuario";

export interface AuthState {
    autenticado: boolean;
    usuario: Usuario | null;
}