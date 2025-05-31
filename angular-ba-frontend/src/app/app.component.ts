import { CommonModule } from '@angular/common';
import {Component, HostListener, inject, OnInit, OnDestroy} from '@angular/core';
import { RouterLink, RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { LoginButtonComponent } from './shared/components/login-button/login-button.component';
import { LogoutButtonComponent } from './shared/components/logout-button/logout-button.component';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, LoginButtonComponent, LogoutButtonComponent, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'angular-ba-frontend';

  public auth = inject(AuthService);
  private router = inject(Router);

  mobileMenuOpen = false;
  sidebarOpen = false;
  currentRoute = '';
  isHoveringTrigger = false;
  private routerSubscription?: Subscription;

  ngOnInit() {
    // Suscribirse a cambios de ruta para cerrar menús y actualizar ruta actual
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.url;
        this.closeSidebar();
        this.closeMobileMenu();
      });
  }

  ngOnDestroy() {
    this.routerSubscription?.unsubscribe();
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    const triggerZone = 20;
    const sidebarWidth = 320;

    // Activar sidebar si el mouse está en la zona de trigger
    if (event.clientX <= triggerZone) {
      this.isHoveringTrigger = true;
      this.sidebarOpen = true;
    }
    // Cerrar sidebar si el mouse sale del área del sidebar
    else if (event.clientX > sidebarWidth && this.sidebarOpen) {
      const sidebar = document.querySelector('.sidebar-content');
      if (sidebar && !sidebar.contains(event.target as Node)) {
        this.isHoveringTrigger = false;
        // Pequeño delay para evitar que se cierre inmediatamente
        setTimeout(() => {
          if (!this.isHoveringTrigger) {
            this.sidebarOpen = false;
          }
        }, 100);
      }
    }
  }

  @HostListener('keydown.escape', ['$event'])
  onEscapeKey(event: KeyboardEvent) {
    if (this.sidebarOpen || this.mobileMenuOpen) {
      this.closeSidebar();
      this.closeMobileMenu();
    }
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    // Cerrar menús en cambio de tamaño para evitar problemas responsive
    this.closeMobileMenu();
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    // Cerrar sidebar si está abierto
    if (this.mobileMenuOpen) {
      this.sidebarOpen = false;
    }
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
  }

  closeSidebar() {
    this.sidebarOpen = false;
    this.isHoveringTrigger = false;
  }

  // Método para verificar si una ruta está activa
  isRouteActive(route: string): boolean {
    return this.currentRoute === route || this.currentRoute.startsWith(route + '/');
  }

  // Navegación con cierre automático
  navigateAndClose(route: string) {
    this.router.navigate([route]);
    this.closeSidebar();
    this.closeMobileMenu();
  }

  getYear() {
    return new Date().getFullYear();
  }

  // Método para obtener información del usuario (si está disponible)
  get userInfo() {
    return this.auth.user$;
  }
}
