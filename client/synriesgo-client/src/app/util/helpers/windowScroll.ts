import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class WindowScroll {
  public scrollToTop() {
    (document.getElementById('areaTrabajo') as any).scrollTo({top: 0, behavior: 'smooth'});
  }

  public scrollToBottom() {
    window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'});
  }
}