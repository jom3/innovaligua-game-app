import { inject } from '@angular/core';
import type { CanActivateFn } from '@angular/router';
import { JwtService } from '../services/jwt.service';

export const authGuard: CanActivateFn = (route, state) => {
  const isTokenActive = inject(JwtService).getIsActiveToken()
  return !isTokenActive;
};
