import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import hljs from 'highlight.js/lib/core';

import ts from 'highlight.js/lib/languages/typescript';
import js from 'highlight.js/lib/languages/javascript';
import py from 'highlight.js/lib/languages/python';
import json from 'highlight.js/lib/languages/json';
import html from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
hljs.registerLanguage('typescript', ts);
hljs.registerLanguage('ts', ts);
hljs.registerLanguage('javascript', js);
hljs.registerLanguage('js', js);
hljs.registerLanguage('python', py);
hljs.registerLanguage('py', py);
hljs.registerLanguage('json', json);
hljs.registerLanguage('html', html);
hljs.registerLanguage('xml', html);
hljs.registerLanguage('css', css);

@Pipe({ name: 'highlight', standalone: true })
export class HighlightPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string): SafeHtml {
    if (!value) return '';
    const parts: string[] = [];
    const fence = /(```|~~~)\s*([a-zA-Z0-9+-_.]*)?\s*\r?\n?([\s\S]*?)\1/gm;

    let last = 0;
    let m: RegExpExecArray | null;

    while ((m = fence.exec(value)) !== null) {
      parts.push(
        this.renderText(this.stripMarkdown(value.slice(last, m.index))),
      );
      const lang = (m[2] || '').trim();
      const code = m[3] ?? '';
      parts.push(this.renderCode(code, lang));
      last = fence.lastIndex;
    }
    parts.push(this.renderText(this.stripMarkdown(value.slice(last))));
    return this.sanitizer.bypassSecurityTrustHtml(parts.join(''));
  }

  private stripMarkdown(text: string): string {
    return text
      .replace(/(\*\*|__)(.*?)\1/g, '$2') // **bold**
      .replace(/(\*|_)(.*?)\1/g, '$2') // *italic*
      .replace(/`([^`]+)`/g, '$1') // `inline`
      .replace(/^(\s*)[-*+]\s+/gm, '') // listas
      .replace(/^\s{0,3}>\s?/gm, '') // citas
      .replace(/^#{1,6}\s+/gm, '') // títulos
      .replace(/\r\n/g, '\n');
  }

  private renderText(text: string): string {
    if (!text) return '';
    const esc = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    return esc.replace(/\n{2,}/g, '<br><br>').replace(/\n/g, '<br>');
  }

  private renderCode(code: string, lang?: string): string {
    const src = code.replace(/^\n+|\n+$/g, '');
    let html: string;
    if (lang && hljs.getLanguage(lang)) {
      html = hljs.highlight(src, { language: lang }).value;
    } else {
      html = hljs.highlightAuto(src).value;
    }
    const cls = lang ? `language-${lang}` : '';
    return `<pre class="hljs overflow-x-auto rounded-lg p-3"><code class="${cls}">${html}</code></pre>`;
  }
}
