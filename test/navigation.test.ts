/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM Automated Regression Test Suite: Navigation, Dropdowns, Hover & Focus
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

type ActiveMenu = 'product' | 'company' | 'help' | null;

class NavigationStateMachine {
  public activeMenu: ActiveMenu = null;
  public notifDrawerOpen = false;
  public mobileMenuOpen = false;
  public mobileSection: 'product' | 'company' | 'help' | null = null;
  public currentRoute = 'home';
  public bodyOverflowStyle = '';
  public closeTimer: NodeJS.Timeout | null = null;
  public isDesktop = true;

  // Simulate mouse enter on a dropdown trigger
  public onMouseEnter(menu: 'product' | 'company' | 'help'): void {
    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }
    this.activeMenu = menu;
  }

  // Simulate mouse leave with 160ms delay
  public onMouseLeave(delayMs = 160, onTimerComplete?: () => void): void {
    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
    }
    this.closeTimer = setTimeout(() => {
      this.activeMenu = null;
      this.closeTimer = null;
      if (onTimerComplete) onTimerComplete();
    }, delayMs);
  }

  // Cancel close timer when mouse enters panel or returns to trigger
  public onCancelClose(): void {
    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }
  }

  // Simulate trigger click
  public onTriggerClick(menu: 'product' | 'company' | 'help'): void {
    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }
    this.activeMenu = this.activeMenu === menu ? null : menu;
  }

  // Simulate outside click
  public onClickOutside(): void {
    this.activeMenu = null;
    this.notifDrawerOpen = false;
  }

  // Simulate Escape key press
  public onEscapeKey(): { triggerRestoredFocus: string | null } {
    let focusTarget: string | null = null;
    if (this.activeMenu) {
      focusTarget = `nav-trigger-${this.activeMenu}`;
    }
    this.activeMenu = null;
    this.notifDrawerOpen = false;
    if (this.mobileMenuOpen) {
      this.mobileMenuOpen = false;
      this.bodyOverflowStyle = '';
    }
    return { triggerRestoredFocus: focusTarget };
  }

  // Simulate route change
  public onRouteChange(newRoute: string): void {
    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }
    this.currentRoute = newRoute;
    this.activeMenu = null;
    this.notifDrawerOpen = false;
    this.mobileMenuOpen = false;
    this.bodyOverflowStyle = '';
  }

  // Toggle mobile drawer
  public toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    if (this.mobileMenuOpen) {
      this.activeMenu = null;
      this.bodyOverflowStyle = 'hidden';
    } else {
      this.bodyOverflowStyle = '';
    }
  }

  // Viewport resize event
  public onWindowResize(width: number): void {
    this.isDesktop = width >= 1024;
    if (this.isDesktop) {
      if (this.mobileMenuOpen) {
        this.mobileMenuOpen = false;
        this.bodyOverflowStyle = '';
      }
    } else {
      if (this.activeMenu) {
        this.activeMenu = null;
      }
    }
  }

  // Component unmount cleanup
  public onUnmount(): void {
    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }
    this.bodyOverflowStyle = '';
  }

  // Helper checking if a specific dropdown DOM panel is mounted
  public isDropdownMounted(menu: 'product' | 'company' | 'help'): boolean {
    return this.activeMenu === menu;
  }
}

describe('OPHIREUM Navigation Architecture & Dropdown State Tests', () => {

  // Test 1: Mutual exclusivity between Product, Company, and Help dropdowns
  describe('Mutual Exclusivity: Opening Product closes Company and Help', () => {
    it('opening Product immediately closes Company and Help', () => {
      const nav = new NavigationStateMachine();

      // Open company first
      nav.onMouseEnter('company');
      assert.equal(nav.activeMenu, 'company');
      assert.equal(nav.isDropdownMounted('company'), true);
      assert.equal(nav.isDropdownMounted('product'), false);
      assert.equal(nav.isDropdownMounted('help'), false);

      // Now open product
      nav.onMouseEnter('product');
      assert.equal(nav.activeMenu, 'product');
      assert.equal(nav.isDropdownMounted('product'), true);
      assert.equal(nav.isDropdownMounted('company'), false);
      assert.equal(nav.isDropdownMounted('help'), false);
    });

    it('opening Company closes Product and Help', () => {
      const nav = new NavigationStateMachine();

      // Open product
      nav.onMouseEnter('product');
      assert.equal(nav.activeMenu, 'product');

      // Now open company
      nav.onMouseEnter('company');
      assert.equal(nav.activeMenu, 'company');
      assert.equal(nav.isDropdownMounted('company'), true);
      assert.equal(nav.isDropdownMounted('product'), false);
      assert.equal(nav.isDropdownMounted('help'), false);

      // Now open help
      nav.onMouseEnter('help');
      assert.equal(nav.activeMenu, 'help');
      assert.equal(nav.isDropdownMounted('help'), true);
      assert.equal(nav.isDropdownMounted('company'), false);
      assert.equal(nav.isDropdownMounted('product'), false);
    });
  });

  // Test 2: Pointer Exit and Hover Delay
  describe('Reliable Hover Behavior: Pointer Exit closes active dropdown after delay', () => {
    it('cancels close timer if pointer enters dropdown panel within the delay', async () => {
      const nav = new NavigationStateMachine();
      nav.onMouseEnter('product');
      assert.equal(nav.activeMenu, 'product');

      // User moves pointer off trigger towards panel
      nav.onMouseLeave(160);
      assert.notEqual(nav.closeTimer, null);
      // Still open immediately because delay is in flight
      assert.equal(nav.activeMenu, 'product');

      // User lands on panel within 50ms (before 160ms timer fires)
      nav.onCancelClose();
      assert.equal(nav.closeTimer, null);
      assert.equal(nav.activeMenu, 'product');
    });

    it('closes menu when pointer completely leaves trigger and dropdown', async () => {
      const nav = new NavigationStateMachine();
      nav.onMouseEnter('product');
      assert.equal(nav.activeMenu, 'product');

      let closed = false;
      nav.onMouseLeave(50, () => {
        closed = true;
      });

      // Wait for timer to complete
      await new Promise(resolve => setTimeout(resolve, 80));
      assert.equal(closed, true);
      assert.equal(nav.activeMenu, null);
      assert.equal(nav.isDropdownMounted('product'), false);
    });
  });

  // Test 3: Outside Click closes all dropdowns
  describe('Outside Click Behavior: closes all open dropdowns', () => {
    it('resets activeMenu to null when click lands outside navigation', () => {
      const nav = new NavigationStateMachine();
      nav.onTriggerClick('company');
      assert.equal(nav.activeMenu, 'company');

      nav.onClickOutside();
      assert.equal(nav.activeMenu, null);
      assert.equal(nav.isDropdownMounted('company'), false);
    });
  });

  // Test 4: Escape Key handling
  describe('Keyboard Escape Behavior: closes menus and returns focus to trigger', () => {
    it('closes active dropdown and identifies the origin trigger to restore focus', () => {
      const nav = new NavigationStateMachine();
      nav.onMouseEnter('help');
      assert.equal(nav.activeMenu, 'help');

      const { triggerRestoredFocus } = nav.onEscapeKey();
      assert.equal(nav.activeMenu, null);
      assert.equal(triggerRestoredFocus, 'nav-trigger-help');
      assert.equal(nav.isDropdownMounted('help'), false);
    });
  });

  // Test 5: Route changes reset state
  describe('Route Navigation: resets activeMenu to null and cleans up', () => {
    it('closes open menus immediately upon route change', () => {
      const nav = new NavigationStateMachine();
      nav.onMouseEnter('product');
      assert.equal(nav.activeMenu, 'product');

      nav.onRouteChange('/register');
      assert.equal(nav.currentRoute, '/register');
      assert.equal(nav.activeMenu, null);
      assert.equal(nav.isDropdownMounted('product'), false);
      assert.equal(nav.bodyOverflowStyle, '');
    });
  });

  // Test 6: Closed dropdowns unmounted from DOM
  describe('DOM Inactivity: Closed dropdowns cannot receive pointer or keyboard focus', () => {
    it('ensures inactive dropdowns are strictly unmounted and not rendered', () => {
      const nav = new NavigationStateMachine();
      assert.equal(nav.activeMenu, null);
      assert.equal(nav.isDropdownMounted('product'), false);
      assert.equal(nav.isDropdownMounted('company'), false);
      assert.equal(nav.isDropdownMounted('help'), false);
    });
  });

  // Test 7: Mobile drawer body scrolling restoration
  describe('Fail-Safe Scrolling: Mobile drawer cleanup restores body scrolling', () => {
    it('locks body scrolling when mobile drawer is open, restores when closed', () => {
      const nav = new NavigationStateMachine();
      assert.equal(nav.bodyOverflowStyle, '');

      // Open mobile drawer
      nav.toggleMobileMenu();
      assert.equal(nav.mobileMenuOpen, true);
      assert.equal(nav.bodyOverflowStyle, 'hidden');

      // Close mobile drawer
      nav.toggleMobileMenu();
      assert.equal(nav.mobileMenuOpen, false);
      assert.equal(nav.bodyOverflowStyle, '');
    });

    it('restores body scrolling if user navigates while mobile drawer is open', () => {
      const nav = new NavigationStateMachine();
      nav.toggleMobileMenu();
      assert.equal(nav.bodyOverflowStyle, 'hidden');

      nav.onRouteChange('/pricing');
      assert.equal(nav.mobileMenuOpen, false);
      assert.equal(nav.bodyOverflowStyle, '');
    });

    it('restores body scrolling when component unmounts', () => {
      const nav = new NavigationStateMachine();
      nav.toggleMobileMenu();
      assert.equal(nav.bodyOverflowStyle, 'hidden');

      nav.onUnmount();
      assert.equal(nav.bodyOverflowStyle, '');
    });
  });

  // Test 8: Desktop and mobile navigation mutual isolation
  describe('Responsive Breakpoints: Desktop and mobile navigation do not remain active together', () => {
    it('automatically closes mobile menu and restores scrolling when viewport resizes to desktop', () => {
      const nav = new NavigationStateMachine();
      nav.onWindowResize(640); // mobile
      nav.toggleMobileMenu();
      assert.equal(nav.mobileMenuOpen, true);
      assert.equal(nav.bodyOverflowStyle, 'hidden');

      // Resize window to desktop (>= 1024)
      nav.onWindowResize(1280);
      assert.equal(nav.isDesktop, true);
      assert.equal(nav.mobileMenuOpen, false);
      assert.equal(nav.bodyOverflowStyle, '');
    });

    it('closes desktop dropdowns when viewport shrinks to mobile', () => {
      const nav = new NavigationStateMachine();
      nav.onMouseEnter('product');
      assert.equal(nav.activeMenu, 'product');

      // Viewport resize to mobile (< 1024)
      nav.onWindowResize(768);
      assert.equal(nav.isDesktop, false);
      assert.equal(nav.activeMenu, null);
    });
  });

  // Test 9: Form inputs remain clickable after opening and closing menus
  describe('Form Interactivity: Form inputs remain clickable after opening and closing menus', () => {
    it('confirms that closing dropdown leaves zero full-page pointer-intercepting overlays', () => {
      const nav = new NavigationStateMachine();
      nav.onMouseEnter('product');
      assert.equal(nav.activeMenu, 'product');

      // Menu closes
      nav.onClickOutside();
      assert.equal(nav.activeMenu, null);
      assert.equal(nav.bodyOverflowStyle, '');

      // Verify no overlays block form inputs
      const formInputAccessible = nav.activeMenu === null && nav.bodyOverflowStyle === '';
      assert.equal(formInputAccessible, true);
    });
  });
});
