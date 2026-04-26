
    const APP_VERSION = '1.1.0';
    const STORAGE_KEY = 'dsworld_clienti_v2';
    const LEGACY_KEY = 'fitplanner_clienti_v1';
    const BACKUP_LATEST_KEY = 'dsworld_clienti_backup_latest_v1';
    const BACKUP_HISTORY_KEY = 'dsworld_clienti_backup_history_v1';
    const SESSION_BACKUP_KEY = 'dsworld_clienti_session_backup_v1';
    const GESTITI_TEMPLATE_BASE64 = 'UEsDBBQAAAAIADivflykm1Ws2wAAADsCAAALABQAX3JlbHMvLnJlbHMBABAAAAAAAAAAAAAAAAAAAAAAAK2SwWrDMAyG730K43ujtIMxRpNexqC3MroH8GwlMYktI6tb9vYzg7EFShlsR0n///EdtNvPYVKvyNlTbPSmqrXCaMn52Df6+fS4vtP7drV7wslIieTBp6xKJ+ZGDyLpHiDbAYPJFSWM5dIRByNl5B6SsaPpEbZ1fQv8k6HbBVMdXKP54DZand4T/o0NAcU4IwYsMa4TlzaLx1zghnuURjuyx7LOn4mqkDVcFtr+Xoi6zlt8IHsOGOWSF86C0aG7rmRSumZ0859Gy8S3zDzBG/H4QjR+ucDiB9rVB1BLAwQUAAAACAA4r35cBCHWFboAAAAbAQAAEQAUAGRvY1Byb3BzL2NvcmUueG1sAQAQAAAAAAAAAAAAAAAAAAAAAABtjk1rhEAQRO/+Cpm7tm4gBFn1llMWAklgr0Pb0WGdD6Y7GX9+JrKYS45FvXrUedzsWn5TZONdr9q6USU59JNxc68+3p+rJzUOxRlDhz7Sa/SBohjiMu8cdxh6tYiEDoBxIau5zoTL5aePVkuOcYag8aZnglPTPIIl0ZMWDb/CKhxGdVdOeCjDV1x3wYRAK1lywtDWLfyxQtHyv4O9OciNzUGllOr0sHP5UQvXy8vbfr4yjkU7JAVD8QNQSwMEFAAAAAgAOK9+XPeOlC+MAAAA1wAAABAAFABkb2NQcm9wcy9hcHAueG1sAQAQAAAAAAAAAAAAAAAAAAAAAACdzs0KwjAQBOB7nyLk3qZ6ECn9uRTPHqr3kmzagNkNyVrq2xsRfACPwzAf0w67f4gNYnKEnTxUtRSAmozDpZO36VKe5dAX7TVSgMgOksgDTJ1cmUOjVNIr+DlVucbcWIp+5hzjoshap2Ek/fSArI51fVKwM6ABU4YfKL9is/G/qCH9+Zfu0ytkT/XFG1BLAwQUAAAACAA4r35cC8oTlOUAAAB1AQAADwAUAHhsL3dvcmtib29rLnhtbAEAEAAAAAAAAAAAAAAAAAAAAAAAjU/BTsMwDL3vKyLfWTI0plI12QUBuwM7h8ZtrDVJlQQ6/p6sUyeOnPzes/383OzPbmDfGBMFL2GzFsDQt8GQ7yW8vz3fVbBXq2YK8fQZwomVcZ/qKMHmPNacp9ai02kdRvSl14XodC409jx0HbX4FNovhz7zeyF2POKgczmVLI0Jrm7/8UpjRG2SRcxuuFo5TR5Uc0n1QTgldQt5oex8JG/CJKF89LPgbSHTjI9ksi0PPzzubtorUm9zEStRCeCq4X/M59tLZV47lPCCKVMmYLN4MGUVWKypgHgw29li2eNLOrX6BVBLAwQUAAAACAA4r35cAcxbHt8AAACpAgAAGgAUAHhsL19yZWxzL3dvcmtib29rLnhtbC5yZWxzAQAQAAAAAAAAAAAAAAAAAAAAAACtks1qwzAQhO95CrH3WnZaSimRcwmFXNv0AYS8tkxsSWi3P3n7blNIYgihB5/EjLQzn5BW6+9xUJ+YqY/BQFWUoDC42PShM/C+e7l7gnW9WL3iYFmOkO8TKZkJZMAzp2etyXkcLRUxYZCdNubRssjc6WTd3naol2X5qPNlBtSTTLVtDORtU4HaHRL+Jzu2be9wE93HiIGvVGjyNmPzxlkuQxJsc4dsYGIXkgr6OsxyVhg+DHhJcdS36u/nrGeZxXP7Uf6Z1S2GhzkZvmLek0fkM8fJ+n0tWU4wevLj6sUPUEsDBBQAAAAIADivflwq1Jl23AUAAAJVAAATABQAeGwvdGhlbWUvdGhlbWUxLnhtbAEAEAAAAAAAAAAAAAAAAAAAAAAA7VxtU9s4EP5+v8Lj761jxyYJ09AB0kxvhmszwM19Vmw5cZFln6RQ4NffSn7HDlAKbW+6yUyil0e7q9WjlbVkePf+JmXWNRUyyfjcdt+ObIvyMIsSvpnbf18u30zt90d/vCOHaktTagGay0Myt7dK5YeOI0NoJvJtllMOfXEmUqKgKjZOJMhXkJIyxxuNDpyUJNwux4unjM/iOAnpIgt3KeWqECIoIwosldskl7bFSUrn9iVIsKLE+mwG2EeVsR8Y1SOlbgiZuAjNDPaOia5c/SXFZn3KhHVN2NwemZftHL1zagBTfdzSvEpcCYiuvB7ueKLftTyvkNfHBWP9ruUZAAlDmE1ft+9PvFO/xLZARbEv+8Nishi7HXxL/rhvc6DfHfy4wfsDvjhtfNYCFcWgP9eT2cmiKz9o8Ac9/GR0vPAnHbwBbVnCrwZXsF6ZGhJn7OMgfLlswRuU02JQMZ6rx/iUki+ZWALQLDLQllvqNqcxCQH/kbJrqpKQWJ/ojmp95JCSRwChfBDg3NOZJvzHG9DodNpuMk5LH/VZnDB2oW4ZPZPGapmxJFpCo6mYwfVS5Vsolmo7uI0gpmyJTP2TqO3FluSgzjUaNrIUvZFWnkkgiL1XtokkCVclT6tQAGii/sqionncDhG1GFPbyLaisRbwVGXjyfcpcwvgE7W5wbC24EFtTsubsE0soo8M98ArVFsyJIxG2u+FgGpZXnGJ3FFrjbYkogPNrfm53gxeL+7N4JuMeBknj3pOdvq7ifFuzfo6t2eBF9hWSPK5HUOMgGKagzzJN7ZF2AaeCUJVTPDxvXhvxrNhVrkjf5/XOypyIdWCyG0xynRVByJv7PcCX/vhZSbgPNeK8dT9iVY495eWxjEN1Z6Wpgp9hZDB3pcHO0OWrTfLXzjo+8/atI0i/1sChx8MBY7Z7PtMeErwaqnzhmfsBcFTw1RO1NbSH0D6RISsOdovs3NYfauOkZaa22+mRVHUjWuwedqanBb1o06Q6ej1z92Ws8d7nD0avY6zgwFfBw+72ulvUaf1LGdqvetWtv4CuhfwpLhjRYvMoVYUVqK/y/depjqwIti63qQbbB8LGuWl6BsCq36QVVRYLElLTow6Ub8d5fSUxlEpu5zcOotuV0JzU3PPknm4TEDTGZFqRQTRPNWXbvUZPmKWwaSysmRb20zcDbVrPNybode2vgo9efnvjghqW+xPrkNNMHFnsMrtimhX1u0K36WnGTOGgHWmWB5iQjFThSLhIegrzi5rl4tks1X1ZsqPdypbJmWgL2ZsFkk2p0FE4xX4ISXizAiEwrkpJDyCJSmUmOOR2RaAL8n64g5Cnuv7pSkGou8RxwZGQCdMWF9mzviJuDLdW3goSvhmteNhbR4ciHlY2Bmuwt7zodNFnFTcDFdKlhfHii7t3uNYPYAre9c7YN7ljVOUL+7qor4X1ZVPGadO6aNz8NHaTGVNJIXHPGoqhuEccOCvikfFtxLJFdV9F6YELeA11yzfrhpytUuTNPtSjOQ6scKSO/qxcZD+5JneCW1q79+XnWRIB9bdDjvdXM7z/rXzFIxYi2Tgvtnp6Vw0Oz3yNh3ucipPVsVVScdr5uavzEEXOVhxcPqrcbDLi5INJTE8JAYSoyaG1xBjjMRAYtTEGDfE8JEYSIyaGH5DjACJgcSoiRE0xDhAYiAxamIcNMSYIDGQGDUxJg0xpkgMJEZNjGlDjBkSA4lRE2OWV+VWwlVWBcbPaWwl0U3p1eJvAvfbCmU9JPi2bjMOKO2s/4xXZ/MZv5fWr52A2foHs/WwLcfD2fqy5/nZetXL1fNM5+rjn56rx/jyf4kvmD9HXmD+HImB+XMkBubPkRiYP0diYP4ciYH5cyQG5s+RGJg/R2Jg/vzZ+fM6ba5unpU/b6FaqW//t/+husKfqePP1PFn6ng8YZodiYFpdiQGptmRGJhmxzQ7EgPT7EgMTLMjMTDNjsTANDsS43dIs5fZdaf/D2mqf1pz9Md/UEsDBBQAAAAIADivflz3uSFWbQQAANgSAAAYABQAeGwvd29ya3NoZWV0cy9zaGVldDEueG1sAQAQAAAAAAAAAAAAAAAAAAAAAACdmFGTokYURt/3V1A87FMi9hUQZ9WtjTLZVDa7U5tJ8sxIq9QCbZpGN/8+TXePQt/qksSHET763nsQPTWwfP+9Kr0z5U3B6pVPJlPfo/WO5UV9WPl/PD/+mPjv12+WF8a/NUdKhSfX180DX/lHIU4PQdDsjrTKmgk70Voe2zNeZULu8kPA9vtiR7ds11a0FgFMp3HAaZkJOas5FqfG193G9GpOnGa5QqhK3arKitpfL/NCdu/wPU73K/8DeUgh9oP1Ui3+s6CXprftdWfywti3bueXfOXLE26O7PIzL/JPRU0bleR0n7Wl6MINK5k8W9J1DFDLR4X4xF8r5Oq/ilwcV34ySWbyde31lV0+0uJwFLJX5Hu7thGsuia+x1pRyvmf6JmWcq3C6Geyc5dJih0rG/XXq4pa1VbZd/V+0aPjSTwnSSJPTPxTUnVEjzNoxHTR9WDq4VofLSbRyOKZKZ5di+V5RySKR9aHpj681c9HD49McfQ/h8evn1w8S8L/1iPQF0F9B7aZyNZLzi6e+p543QWFEF9iOblb8UEuabqPOzDBTzqYyQXndRhPYbYMzt0Ic3yjj4fXgq0MZMdGxZEqmw5LUl2ifgaBJLvigcYjyWQeuQnBJoTewLkaSCxGuA3UjP2SRJWAxahLFohxZhhjN+DMBtQBmV6TzezWXQOZJeSapDMHQHgfILQBdEBuySa0AUIEEDoAovsAkQ2gAzK7AUQ2QNS7JCRU18T6qqWRgyi+TxTbRDEiim0isyS6fSSxA2B+H2BuA8wRwNwGsIN07pif3J+f2PMTND+x55slt99NmjgAFvcBFjbAAgEsbAA7SBeO+fK3dRegW2OpbYoQTNRjQEnaT4YUZAQFFizBFARREERBXBQwggJJ1CQDCkAUgChcniQjREmQKU0yoECuRElKXLIkI2xJkC5NMqBAwkRJSlzGJCOUSZAzTdK3NkHWRElKXJYkIzRJkCdNMqBApkRJSlyqJCNcSZAsTTKgQLpESUpcwiQjjEmQMk0yoEDSRElKXNYkI7RJkDdNMqBA5kRJSlzuhBHuBOROk/QpALkTJSm43Akj3AnInSYZUCB3oiQFlzthhDsB/wMKmAK5EyUpuNwJI9wJyJ0mGVAgd6IkBZc7YYQ7AbkT8P+agNyJkhRc7oQR7gTkTsDuBOROlKTgcieMcCcgdwJ2JyB3oiQF5M6gdytXUX6gG1qWjbdjbd3dzvm9VD9n2MLDVt2S2Xn0sNX3Xbc26+UpO9DfMn4o6sYr6V62nE6kObk+Q7Ut2EltyQ/ohQl5/q97R5rllHd78nu0Z0y87gS67+9UtCdvX/BGPMndz231QvWd6L4Qz6z3jEHtX29jvWaXqRvcqTRG29BHu0P3BIIXtBbqic3KPzEueFYI3+vGfuGKKmeX+vlI6y9nyjsiTfuoMNdLludm821Wnd5t1N+3f7dMvPtIyzMVxS7zPtOW/vCVHtoy4/qYWkZAvf06VS+1/bQMbh2XwXBWcH1ItX7zL1BLAwQUAAAACAA4r35cy8WwE5kBAADTAwAAFAAUAHhsL3NoYXJlZFN0cmluZ3MueG1sAQAQAAAAAAAAAAAAAAAAAAAAAAC1U2Fr2zAQ/d5fcehTB1uVjTFKsF1KlpTCGINlP+AiX50D6eRKsin99TvHWduwfVsLxuiepHfv3p2qq4fgYaSUOUptPl4sDJC42LJ0tfm13Xy4NFfNWZVzgUH4fqBVHKTU5rMBvSm5NvtS+qW12e0pYL6IPYnu3MUUsGiYOpv7RNjmPVEJ3n5aLL7YgCymqTI3VWm+rW/W379eV7Y0lZ2gAzzxL3OPjmqjBJnSSKa5Wf/c3m5v4fRw0u+H/nYwotcyjFX88RgcIhd9TMDS0gO1tbmcsLSJUuZDK/S8Szyh9sBU/mSaE6XnHP/J+++yllCGUhgYnGcSXW24XLvCI0FPCdzAgLsdY4jgcYwJSwSEHjsMejxCOySUQsAegpJCy5D4jhLP239V8dKpYV5n7bmn17DuXKLoBa2Nk0oS0LnJqoL8NFtPJSpGSfg9CKHo+MCs20V0e9UCUTwLvXvS/qbtXh1FZeoGLpMKAa/mp9glDAEf9YHwaw+D9n1EkXg0a0qvFOrHcxfR3Q88mdeS93iqh06tsfpKm7PfUEsDBBQAAAAIADivflyzqGZuawMAAJocAAANABQAeGwvc3R5bGVzLnhtbAEAEAAAAAAAAAAAAAAAAAAAAAAA1Vlbb5swFH7vr0B+Xw25tGQKqbZI2fZSTWon7dUBQywZGxmnS/vr5wsEmsEaStoSpBRfzvnO+c6xDYfOb3YpdR6wyAlnAfAuXeBgFvKIsCQAv+5Xn3xws7iY5/KR4rsNxtJRCiwPwEbK7DOEebjBKcoveYaZmom5SJFUXZHAPBMYRblWSikcue4VTBFhYDFn23SVytwJ+ZbJAIz2Q469/YgCoByxYEse4QB8wwwLRAFsEJ3Onsum6tKCsLCzmMecVeY8F9iRxTx/ch4QVUOelg855cIhLMI7rGB9Ywyl2MosESVrQQyw1T7AGL2M8R3TByxJiJxbvMXtUNPXu7MuIPTEHm/SgKfC8HrA0WkcJE3Y3onJnwhva9u52hkUn8pAF4z94vkH5XRhNDe9YQil+w0zBXZgMc+QlFiwleo4Rfv+MVNbjnFWLGcj94J0ItCjN5oer5BzSiLtRbJsILQuRtFW8iIKsAbV24gN5ZtbcbtYMTeVqDUXkTq992ebB8qxxZziWCp9QZKNvkueaQNcSp6qRkRQwhmi2kKpUdd0zJkfALkxZ/bBSpoZz7RcYeD/4iZP0AgaR44BV2Klu8eIW8m+vPxDXvA1/h4RXtgH/5TxgO9E9Bjk810gH7azDgMH3z8kPT0+n1QPPhP+WWWiaKinWIgpvdNgv+PqUaYgd/FhRcDKJsoy+ni7TddYrMy7fzW64la/6KkHZTX31Zis+l8oSViK6wo/BZc4lKYg0qUCKkV0naTfvxScpWUY7mL1p07A0qkzuT4jKt389Ibop11WuuP1Dq73dk7bstV6PVZNZV83R3UCo85R905BYMMFeVLgmkKoBrAANVLFSKdMjIeciUktE5MqE+M6gcnHZKJf1KfnEvVpS9Svzm3910m5FalJndT1x5PSrwgNlJw/AmX3eCfL0vPoleYPeaXVnPZbcjLr7P975eSINDQy8gfLqNMqa0uY5w6PX881OERKfc86f3hnnapgOh9057LDOnObDfkQh0UhVSsQn5WH+1FHf9MOwK32mAJnF5fPpy2hkjDbg/U6TWFGu6pEM7MSrSl+bsXdf0RXCkVpuyy6Ilnbb7WqEYA4ds2lFQ5n7NU806bjuvrXPKPn2uy0edCmo8fbZtp8Q+bqxhRH19HYrseDOMIyvrD6L+Pi4i9QSwMEFAAAAAgAOK9+XNzcivOUAQAAuAYAABMAFABbQ29udGVudF9UeXBlc10ueG1sAQAQAAAAAAAAAAAAAAAAAAAAAACtlctuwjAQRff9iijbKjF0UVUVj0Vply1S6QeYeJIY4odsE8LfdxwKqpATQLBJlBmfe2fGTjKaNqKKajCWKzmOh+kgjkBminFZjOOfxUfyEk8nD6PFToONcK2047h0Tr8SYrMSBLWp0iAxkysjqMNHUxBNszUtgDwNBs8kU9KBdInzGvFkNIOcbioXvTcY3vsiHkdv+3XeahxTrSueUYdp4rMkyBmobA9YS3ZSXfJXWYpku8aWXNvHboeVhuLEgQvf2koXHYiWYcLHw8RS6CDh42Gi4HmQ8PEw4ToI10lolvfM1mfDnFB1D4dZDh1k3XsMArup8pxnwFS2EYikyM8M3fLOQTeVbW5ysNoAZbYEcKJK27u3+sI3yHAG0Zwa90kF6hJk5kZpi+ffQNpc29rhoHo60SgExnE4HtVeR5S+3vCkU/BTY8Au9G4qslVmvVRqfbN1YMipoFye8bclNcC+ncH9t3cv4p/2uTrcroK7F9CKnnF2+EGG/XV4s38rc8GWtxVa0t6Gd+76qH+og7Q/osnDL1BLAQI+ABQAAAAIADivflykm1Ws2wAAADsCAAALAAAAAAAAAAAAAAAAAAAAAABfcmVscy8ucmVsc1BLAQI+ABQAAAAIADivflwEIdYVugAAABsBAAARAAAAAAAAAAAAAAAAABgBAABkb2NQcm9wcy9jb3JlLnhtbFBLAQI+ABQAAAAIADivflz3jpQvjAAAANcAAAAQAAAAAAAAAAAAAAAAABUCAABkb2NQcm9wcy9hcHAueG1sUEsBAj4AFAAAAAgAOK9+XAvKE5TlAAAAdQEAAA8AAAAAAAAAAAAAAAAA4wIAAHhsL3dvcmtib29rLnhtbFBLAQI+ABQAAAAIADivflwBzFse3wAAAKkCAAAaAAAAAAAAAAAAAAAAAAkEAAB4bC9fcmVscy93b3JrYm9vay54bWwucmVsc1BLAQI+ABQAAAAIADivflwq1Jl23AUAAAJVAAATAAAAAAAAAAAAAAAAADQFAAB4bC90aGVtZS90aGVtZTEueG1sUEsBAj4AFAAAAAgAOK9+XPe5IVZtBAAA2BIAABgAAAAAAAAAAAAAAAAAVQsAAHhsL3dvcmtzaGVldHMvc2hlZXQxLnhtbFBLAQI+ABQAAAAIADivflzLxbATmQEAANMDAAAUAAAAAAAAAAAAAAAAAAwQAAB4bC9zaGFyZWRTdHJpbmdzLnhtbFBLAQI+ABQAAAAIADivflyzqGZuawMAAJocAAANAAAAAAAAAAAAAAAAAOsRAAB4bC9zdHlsZXMueG1sUEsBAj4AFAAAAAgAOK9+XNzcivOUAQAAuAYAABMAAAAAAAAAAAAAAAAAlRUAAFtDb250ZW50X1R5cGVzXS54bWxQSwUGAAAAAAoACgCAAgAAbhcAAAAA';
    const DAYS_IT = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];
    const MONTHS_IT = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
    const _FALLBACK_TIMES = ['07:00', '08:00', '09:00', '10:00', '12:30', '14:00', '16:00', '18:00', '19:00', '20:00'];
    function getDefaultTimes() {
      if (!state.lessons || state.lessons.length < 5) return _FALLBACK_TIMES;
      const counts = new Map();
      state.lessons.forEach(l => { if (l.time) counts.set(l.time, (counts.get(l.time) || 0) + 1); });
      const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]).map(e => e[0]).slice(0, 10);
      return sorted.length >= 5 ? sorted : _FALLBACK_TIMES;
    }
    const SUPABASE_CONFIG_KEY = 'dsworld_supabase_config_v1';
    const GOOGLE_FN_BASE = '/.netlify/functions';

    /* ── Credenziali Supabase ───────────────────────────────────────
       Strategia a 3 livelli (sicura + sempre funzionante):
       1. Prova a caricarle da /api/config (Netlify Function — più sicuro)
       2. Se /api/config non è ancora deployata, prova /.netlify/functions/config
       3. Se entrambe falliscono, usa i valori di fallback hardcoded
          (accettabile finché il sito non ha utenti multipli)
       Le credenziali Supabase anon key sono pubbliche per design:
       la sicurezza reale è garantita dalle RLS policy su Supabase.
    ─────────────────────────────────────────────────────────────── */
    let DEFAULT_SUPABASE_URL = ''; // Sarà caricato da un endpoint sicuro
    let DEFAULT_SUPABASE_ANON_KEY = ''; // Sarà caricato da un endpoint sicuro

    async function loadRemoteConfig() {
      const endpoints = ['/api/config', '/.netlify/functions/config'];
      for (const url of endpoints) {
        try {
          const res = await fetch(url, { cache: 'no-store' });
          if (!res.ok) continue;
          const cfg = await res.json();
          if (cfg.supabaseUrl && cfg.supabaseAnonKey) {
            DEFAULT_SUPABASE_URL = cfg.supabaseUrl;
            DEFAULT_SUPABASE_ANON_KEY = cfg.supabaseAnonKey;
            console.info('[DSWORLD] Config cloud caricata da', url);
            return;
          }
        } catch (_) { /* prova il prossimo endpoint */ }
      }
      console.info('[DSWORLD] Usando config locale (Netlify Function non ancora attiva)');
    }
    const cloud = { client: null, session: null, user: null, config: null, saveTimer: null, listenerBound: false, saving: false, allowLocalOnly: false, hydrated: false, google: { connected: false, calendarId: '', calendarName: '', googleEmail: '', lastError: '', lastSyncAt: '', syncing: false }, googleQueue: Promise.resolve() };

    const state = {
      clients: [],
      packages: [],
      plans: [],
      lessons: [],
      selectedClientId: null,
      selectedLessonId: null,
      selectedDay: todayISO(),
      selectedPackageId: null,
      viewDate: startOfMonth(new Date()),
      calendarView: 'month',
      search: '',
      clientFilter: 'all',
      heroAlertsExpanded: false,
      calendarQuickSearch: '',
      googleBlockingBusy: [],
      googleBlockingBusyKey: '',
      pendingAdd: null,
      pendingTimeValue: '',
      reportOpenedOnce: false,
      dismissedAlerts: []
    };

    const derived = {
      lessonsByDate: null,
      alerts: null,
      monthSnapshots: null
    };

    function invalidateDerivedData() {
      derived.lessonsByDate = null;
      derived.alerts = null;
      derived.monthSnapshots = null;
    }

    const el = {
      heroSubtitle: document.getElementById('heroSubtitle'),
      heroInsights: document.getElementById('heroInsights'),
      heroStats: document.getElementById('heroStats'),
      opsBoard: document.getElementById('opsBoard'),
      selectedClientCard: document.getElementById('selectedClientCard'),
      mobileSelectedClientCard: document.getElementById('mobileSelectedClientCard'),
      alertStrip: document.getElementById('alertStrip'),
      clientCountTag: document.getElementById('clientCountTag'),
      clientSearch: document.getElementById('clientSearch'),
      clientFilterRow: document.getElementById('clientFilterRow'),
      clientList: document.getElementById('clientList'),
      monthLabel: document.getElementById('monthLabel'),
      calendarMeta: document.getElementById('calendarMeta'),
      calendarHead: document.getElementById('calendarHead'),
      calendarGrid: document.getElementById('calendarGrid'),
      agendaWrap: document.getElementById('agendaWrap'),
      calendarQuickSearch: document.getElementById('calendarQuickSearch'),
      calendarQuickSearchResults: document.getElementById('calendarQuickSearchResults'),
      calendarViewButtons: [...document.querySelectorAll('[data-calendar-view]')],
      toast: document.getElementById('toast'),

      clientModalBackdrop: document.getElementById('clientModalBackdrop'),
      clientModalTitle: document.getElementById('clientModalTitle'),
      clientForm: document.getElementById('clientForm'),
      clientId: document.getElementById('clientId'),
      clientPlanId: document.getElementById('clientPlanId'),
      clientName: document.getElementById('clientName'),
      clientSurname: document.getElementById('clientSurname'),
      clientEmail: document.getElementById('clientEmail'),
      clientSendCalendarInvite: document.getElementById('clientSendCalendarInvite'),
      clientServiceType: document.getElementById('clientServiceType'),
      clientPackage: document.getElementById('clientPackage'),
      clientPackagePrice: document.getElementById('clientPackagePrice'),
      clientStartDate: document.getElementById('clientStartDate'),
      clientFreeSessionDone: document.getElementById('clientFreeSessionDone'),
      clientPackagePurchased: document.getElementById('clientPackagePurchased'),
      clientConversionStatus: document.getElementById('clientConversionStatus'),
      clientPaymentStatus: document.getElementById('clientPaymentStatus'),
      clientPaymentMode: document.getElementById('clientPaymentMode'),
      clientInstallmentsRow: document.getElementById('clientInstallmentsRow'),
      clientInstallmentsTotal: document.getElementById('clientInstallmentsTotal'),
      clientInstallmentsPaid: document.getElementById('clientInstallmentsPaid'),
      clientHistoryWrap: document.getElementById('clientHistoryWrap'),
      clientPaymentHistory: document.getElementById('clientPaymentHistory'),
      clientRenewalHistory: document.getElementById('clientRenewalHistory'),
      clientAppointmentsWrap: document.getElementById('clientAppointmentsWrap'),
      clientAppointmentsList: document.getElementById('clientAppointmentsList'),
      copyAppointmentsBtn: document.getElementById('copyAppointmentsBtn'),
      clientFixedTime: document.getElementById('clientFixedTime'),
      clientWeekdayPicker: document.getElementById('clientWeekdayPicker'),
      clientVariableScheduleGrid: document.getElementById('clientVariableScheduleGrid'),
      variableScheduleBlock: document.getElementById('variableScheduleBlock'),
      fixedScheduleBlock: document.getElementById('fixedScheduleBlock'),
      fixedScheduleHint: document.getElementById('fixedScheduleHint'),
      fixedScheduleQuickText: document.getElementById('fixedScheduleQuickText'),
      fixedSchedulePreview: document.getElementById('fixedSchedulePreview'),
      clientCheckMode: document.getElementById('clientCheckMode'),
      clientNotes: document.getElementById('clientNotes'),
      packagePreview: document.getElementById('packagePreview'),
      deleteClientBtn: document.getElementById('deleteClientBtn'),

      packagesModalBackdrop: document.getElementById('packagesModalBackdrop'),
      packageForm: document.getElementById('packageForm'),
      packageId: document.getElementById('packageId'),
      packageName: document.getElementById('packageName'),
      packageLessons: document.getElementById('packageLessons'),
      packageWeeks: document.getElementById('packageWeeks'),
      packagePerWeek: document.getElementById('packagePerWeek'),
      packageDuration: document.getElementById('packageDuration'),
      packagePrice: document.getElementById('packagePrice'),
      packageList: document.getElementById('packageList'),
      deletePackageBtn: document.getElementById('deletePackageBtn'),

      dayModalBackdrop: document.getElementById('dayModalBackdrop'),
      dayModalTitle: document.getElementById('dayModalTitle'),
      dayModalSubtitle: document.getElementById('dayModalSubtitle'),
      daySlotGrid: document.getElementById('daySlotGrid'),
      dayLessonsWrap: document.getElementById('dayLessonsWrap'),
      dayLessonList: document.getElementById('dayLessonList'),
      dayAddLessonBtn: document.getElementById('dayAddLessonBtn'),

      lessonModalBackdrop: document.getElementById('lessonModalBackdrop'),
      lessonModalTitle: document.getElementById('lessonModalTitle'),
      lessonModalSubtitle: document.getElementById('lessonModalSubtitle'),
      lessonQuickTimes: document.getElementById('lessonQuickTimes'),
      lessonTimeInput: document.getElementById('lessonTimeInput'),
      lessonNoteInput: document.getElementById('lessonNoteInput'),
      rescheduleList: document.getElementById('rescheduleList'),
      duoSection: document.getElementById('duoSection'),
      duoPartnerRow: document.getElementById('duoPartnerRow'),
      duoPartnerBadge: document.getElementById('duoPartnerBadge'),
      duoUnlinkBtn: document.getElementById('duoUnlinkBtn'),
      duoAddRow: document.getElementById('duoAddRow'),
      duoClientSelect: document.getElementById('duoClientSelect'),
      duoLinkBtn: document.getElementById('duoLinkBtn'),

      timeModalBackdrop: document.getElementById('timeModalBackdrop'),
      timeModalTitle: document.getElementById('timeModalTitle'),
      timeModalSubtitle: document.getElementById('timeModalSubtitle'),
      timeSuggestionChips: document.getElementById('timeSuggestionChips'),
      timeManualInput: document.getElementById('timeManualInput'),

      renewModalBackdrop: document.getElementById('renewModalBackdrop'),
      renewForm: document.getElementById('renewForm'),
      renewPrice: document.getElementById('renewPrice'),
      renewPriceHint: document.getElementById('renewPriceHint'),
      renewPackage: document.getElementById('renewPackage'),
      renewStartDate: document.getElementById('renewStartDate'),
      renewCheckMode: document.getElementById('renewCheckMode'),
      renewPreview: document.getElementById('renewPreview'),

      reportModalBackdrop: document.getElementById('reportModalBackdrop'),
      reportMonthLabel: document.getElementById('reportMonthLabel'),
      reportStats: document.getElementById('reportStats'),
      reportFilterBar: document.getElementById('reportFilterBar'),
      reportMoodTitle: document.getElementById('reportMoodTitle'),
      reportMoodText: document.getElementById('reportMoodText'),
      reportMoodTextPanel: document.getElementById('reportMoodTextPanel'),
      reportNewClients: document.getElementById('reportNewClients'),
      reportTopPackages: document.getElementById('reportTopPackages'),
      reportFreeSession: document.getElementById('reportFreeSession'),
      reportPack99: document.getElementById('reportPack99'),
      reportPersonal: document.getElementById('reportPersonal'),
      reportSectionFreeSession: document.getElementById('reportSectionFreeSession'),
      reportSectionPack99: document.getElementById('reportSectionPack99'),
      reportSectionPersonal: document.getElementById('reportSectionPersonal'),
      reportOutstanding: document.getElementById('reportOutstanding'),
      reportInstallments: document.getElementById('reportInstallments'),
      reportSectionOutstanding: document.getElementById('reportSectionOutstanding'),
      reportSectionInstallments: document.getElementById('reportSectionInstallments'),
      reportCancelRanking: document.getElementById('reportCancelRanking'),
      reportFollowups: document.getElementById('reportFollowups'),
      exportManagedXlsxBtn: document.getElementById('exportManagedXlsxBtn'),

      authShell: document.getElementById('authShell'),
      sbProjectUrl: document.getElementById('sbProjectUrl'),
      sbAnonKey: document.getElementById('sbAnonKey'),
      saveSupabaseConfigBtn: document.getElementById('saveSupabaseConfigBtn'),
      useDemoLocalBtn: document.getElementById('useDemoLocalBtn'),
      supabaseConfigStatus: document.getElementById('supabaseConfigStatus'),
      authMessage: document.getElementById('authMessage'),
      userBadge: document.getElementById('userBadge'),
      syncBadge: document.getElementById('syncBadge'),
      openAccountBtn: document.getElementById('openAccountBtn'),
      loginPanel: document.getElementById('loginPanel'),
      signupPanel: document.getElementById('signupPanel'),
      resetPanel: document.getElementById('resetPanel'),
      authLoginEmail: document.getElementById('authLoginEmail'),
      authLoginPassword: document.getElementById('authLoginPassword'),
      authSignupEmail: document.getElementById('authSignupEmail'),
      authSignupPassword: document.getElementById('authSignupPassword'),
      authResetEmail: document.getElementById('authResetEmail'),
      showResetTabBtn: document.getElementById('showResetTabBtn'),

      passwordUpdateModalBackdrop: document.getElementById('passwordUpdateModalBackdrop'),
      passwordUpdateForm: document.getElementById('passwordUpdateForm'),
      passwordUpdateInput: document.getElementById('passwordUpdateInput'),

      accountModalBackdrop: document.getElementById('accountModalBackdrop'),
      cloudUserEmail: document.getElementById('cloudUserEmail'),
      cloudStatusLabel: document.getElementById('cloudStatusLabel'),
      cloudProjectUrl: document.getElementById('cloudProjectUrl'),
      cloudAnonKey: document.getElementById('cloudAnonKey'),
      saveCloudConfigBtn: document.getElementById('saveCloudConfigBtn'),
      manualSyncBtn: document.getElementById('manualSyncBtn'),
      sendResetPasswordBtn: document.getElementById('sendResetPasswordBtn'),
      logoutBtnModal: document.getElementById('logoutBtnModal'),
      googleStatusLabel: document.getElementById('googleStatusLabel'),
      googleStatusHint: document.getElementById('googleStatusHint'),
      connectGoogleBtn: document.getElementById('connectGoogleBtn'),
      googleResyncBtn: document.getElementById('googleResyncBtn'),
      disconnectGoogleBtn: document.getElementById('disconnectGoogleBtn')

    };

    function uid(prefix = 'id') {
      let rand;
      try {
        const buf = new Uint8Array(6);
        crypto.getRandomValues(buf);
        rand = Array.from(buf, b => b.toString(36).padStart(2, '0')).join('').slice(0, 8);
      } catch(e) {
        rand = Math.random().toString(36).slice(2, 10);
      }
      return `${prefix}_${rand}_${Date.now().toString(36)}`;
    }

    function generateShareToken() {
      try {
        const buf = new Uint8Array(18);
        crypto.getRandomValues(buf);
        return Array.from(buf, b => b.toString(36).padStart(2,'0')).join('').slice(0, 24);
      } catch(e) {
        return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
      }
    }

    /* URL del portale cliente — adatta al tuo dominio */
    function clientPortalUrl(token) {
      const base = window.location.origin + '/' + 'client.html';
      return `${base}?t=${token}`;
    }

    function pad(n) { return String(n).padStart(2, '0'); }
    function toISO(date) { return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`; }
    function fromISO(iso) {
      if (!iso) return new Date();
      const [y, m, d] = String(iso).slice(0, 10).split('-').map(Number);
      return new Date(y, (m || 1) - 1, d || 1);
    }
    function todayISO() { return toISO(new Date()); }
    function startOfMonth(date) { return new Date(date.getFullYear(), date.getMonth(), 1); }
    function addDays(date, days) { const copy = new Date(date); copy.setDate(copy.getDate() + days); return copy; }
    function addWeeks(date, weeks) { return addDays(date, weeks * 7); }
    function addMonths(date, months) { return new Date(date.getFullYear(), date.getMonth() + months, 1); }
    function sameMonth(date, monthDate) { return date.getMonth() === monthDate.getMonth() && date.getFullYear() === monthDate.getFullYear(); }
    function formatDateShort(iso) { return fromISO(iso).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' }); }
    function formatDateFancy(iso) { return fromISO(iso).toLocaleDateString('it-IT', { weekday: 'short', day: '2-digit', month: 'long' }); }
    function formatMonthLabel(date) { return `${MONTHS_IT[date.getMonth()]} ${date.getFullYear()}`; }
    function minutesFromTime(time) {
      const [h, m] = String(time || '00:00').split(':').map(Number);
      return (h || 0) * 60 + (m || 0);
    }
    function normalizeWeekday(jsDay) { return jsDay === 0 ? 7 : jsDay; }
    function initials(name) {
      return String(name || '?').split(' ').filter(Boolean).slice(0, 2).map(part => part[0].toUpperCase()).join('') || '?';
    }
    function splitFullName(value) {
      const parts = String(value || '').trim().split(/\s+/).filter(Boolean);
      return {
        firstName: parts.shift() || '',
        lastName: parts.join(' ')
      };
    }
    function getClientFullName(client) {
      if (!client) return 'Cliente';
      const first = String(client.firstName || '').trim();
      const last = String(client.lastName || '').trim();
      return [first, last].filter(Boolean).join(' ').trim() || String(client.name || 'Cliente').trim() || 'Cliente';
    }
    function weekdayLabel(day) {
      return DAYS_IT[(Number(day || 1) - 1 + 7) % 7] || '---';
    }
    function sortWeekdays(days) {
      return [...new Set((days || []).map(Number).filter(day => day >= 1 && day <= 7))].sort((a, b) => a - b);
    }
    function cloneJson(value) {
      try { return structuredClone(value || {}); } catch(_) { return JSON.parse(JSON.stringify(value || {})); }
    }
    function normalizeCheckMode(mode) {
      if (mode === 'both') return '12';
      return ['8', '12', 'none'].includes(mode) ? mode : '12';
    }
    function escapeHtml(value) {
      return String(value ?? '').replace(/[&<>"'`]/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;', '`':'&#96;' }[char]));
    }

    function showToast(message, type = 'info') {
      const icons = { ok: '✓', warn: '⚠', error: '✕', info: '' };
      const durations = { ok: 2200, warn: 4000, error: 4500, info: 2200 };
      const icon = icons[type] || '';

      // Evita innerHTML con testo dinamico: riduce il rischio XSS se un messaggio
      // dovesse arrivare da input utente, errori esterni o dati sincronizzati.
      el.toast.textContent = '';
      if (icon) {
        const iconSpan = document.createElement('span');
        iconSpan.className = 'toast-icon';
        iconSpan.textContent = icon;

        const messageSpan = document.createElement('span');
        messageSpan.textContent = String(message ?? '');

        el.toast.append(iconSpan, messageSpan);
      } else {
        el.toast.textContent = String(message ?? '');
      }

      el.toast.className = 'toast';
      if (type !== 'info') el.toast.classList.add(`toast-${type}`);
      el.toast.classList.add('show');
      clearTimeout(showToast._t);
      showToast._t = setTimeout(() => el.toast.classList.remove('show'), durations[type] || 2200);
      /* Haptic: pulse breve su ok, doppio su errore */
      if (type === 'ok') haptic(8);
      else if (type === 'error') haptic([10, 60, 10]);
      else if (type === 'warn') haptic(20);
    }

    function formatNumberMax2(value) {
      const amount = Number(value || 0);
      if (!Number.isFinite(amount)) return '0';
      return amount.toLocaleString('it-IT', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
    }

    function formatCurrency(value) {
      const amount = Number(value || 0);
      if (!Number.isFinite(amount)) return '0,00 €';
      return amount.toLocaleString('it-IT', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }

    function getPackageUnitValue(pkg) {
      const lessonsTotal = Number(pkg?.lessonsTotal || 0);
      const totalPrice = Number(pkg?.totalPrice || 0);
      return lessonsTotal > 0 ? totalPrice / lessonsTotal : 0;
    }

    function seedPackages() {
      return [
        { id: uid('pkg'), name: 'Start 8', lessonsTotal: 8, weeks: 4, perWeek: 2, duration: 60, totalPrice: 0, createdAt: new Date().toISOString() },
        { id: uid('pkg'), name: 'Base 12', lessonsTotal: 12, weeks: 8, perWeek: 2, duration: 60, totalPrice: 0, createdAt: new Date().toISOString() },
        { id: uid('pkg'), name: 'Intensivo 16', lessonsTotal: 16, weeks: 8, perWeek: 2, duration: 75, totalPrice: 0, createdAt: new Date().toISOString() }
      ];
    }

    function serviceTypeLabel(type) {
      if (type === 'free_session') return 'FREE SESSION';
      return 'PERSONAL';
    }

    function isPack99Package(pkgOrName) {
      const raw = typeof pkgOrName === 'string' ? pkgOrName : (pkgOrName?.name || '');
      const normalized = String(raw || '').toUpperCase().replace(/\s+/g, '');
      return normalized === 'PACK99';
    }

    function getPlanTotalPrice(plan, pkg = null, client = null) {
      const direct = Number(plan?.totalPrice || 0);
      if (direct > 0) return direct;
      const clientPrice = Number(client?.packagePrice || 0);
      if (clientPrice > 0) return clientPrice;
      return Number((pkg || getPackage(plan?.packageId))?.totalPrice || 0);
    }

    function getPlanUnitValue(plan, pkg = null, client = null, lesson = null) {
      if (lesson && (lesson.lessonType || lesson.type) === 'free_session') return 0;
      const packageObj = pkg || getPackage(plan?.packageId);
      const lessonsTotal = Number(packageObj?.lessonsTotal || 0);
      const totalPrice = getPlanTotalPrice(plan, packageObj, client);
      return lessonsTotal > 0 ? totalPrice / lessonsTotal : 0;
    }

    function ensureSpecialPackage(type, freeDone = false) {
      const matchName = type === 'free_session'
        ? 'FREE SESSION'
        : (freeDone ? 'PACK 99' : 'PACK 99 + FREE SESSION');
      let pkg = state.packages.find(item => String(item.name || '').toUpperCase() === matchName);
      if (pkg) return pkg;
      pkg = {
        id: uid('pkg'),
        name: matchName,
        lessonsTotal: type === 'free_session' ? 1 : (freeDone ? 3 : 4),
        weeks: type === 'free_session' ? 1 : 4,
        perWeek: 1,
        duration: 60,
        totalPrice: 0,
        createdAt: new Date().toISOString()
      };
      state.packages.unshift(pkg);
      return pkg;
    }

    function getClientServiceType(client) {
      return client?.serviceType || 'personal';
    }

    function isManagedClient(client) {
      return getClientServiceType(client) !== 'free_session';
    }

    function getManagedClients() {
      return state.clients.filter(isManagedClient);
    }

    function getDefaultSelectedClientId(preferredId = null) {
      if (preferredId && state.clients.some(client => client.id === preferredId)) return preferredId;
      const managedClients = getManagedClients();
      if (managedClients.length) return managedClients[0].id;
      return state.clients[0]?.id || null;
    }

    function getTodayLessonBreakdown(date = todayISO()) {
      return state.lessons.reduce((acc, lesson) => {
        if (lesson.date !== date || lesson.status === 'cancelled') return acc;
        const type = getLessonServiceType(lesson);
        if (type === 'free_session') acc.free += 1;
        else acc.personal += 1;
        return acc;
      }, { personal: 0, free: 0 });
    }

    function getClientOfferLabel(client, plan = null, pkg = null) {
      const type = getClientServiceType(client);
      if (type === 'free_session') return 'FREE SESSION';
      return ((pkg?.name || serviceTypeLabel(type)) + (pkg && pkg.weeks ? ` (${pkg.perWeek || 1} x week)` : '')).toUpperCase();
    }

    function getLessonServiceType(lesson, client = null) {
      return lesson?.lessonType || getClientServiceType(client || getClient(lesson?.clientId));
    }

    function getDuoPartner(lesson) {
      if (!lesson?.duoGroupId) return null;
      return state.lessons.find(l => l.duoGroupId === lesson.duoGroupId && l.id !== lesson.id) || null;
    }

    function getLessonDisplayTitle(lesson) {
      const client = getClient(lesson.clientId);
      const partner = getDuoPartner(lesson);
      const partnerName = partner ? ` + ${getClientFullName(getClient(partner.clientId))}` : '';
      return `${getClientFullName(client)}${partnerName} · ${serviceTypeLabel(getLessonServiceType(lesson, client))}`;
    }

    function clientHasAnyFreeSession(clientId) {
      return state.lessons.some(item => item.clientId === clientId && getLessonServiceType(item) === 'free_session' && item.status !== 'cancelled');
    }

    function lessonTypeForNewLesson(client) {
      return getClientServiceType(client);
    }

    function getVisibleAvailabilityRange() {
      if (state.calendarView === 'week') {
        const anchor = getCalendarAnchorDate();
        const monday = addDays(anchor, -((anchor.getDay() + 6) % 7));
        const sunday = addDays(monday, 7);
        return { start: `${toISO(monday)}T00:00:00`, end: `${toISO(sunday)}T23:59:59` };
      }
      if (state.calendarView === 'day') {
        const iso = state.selectedDay || todayISO();
        return { start: `${iso}T00:00:00`, end: `${iso}T23:59:59` };
      }
      const first = new Date(state.viewDate.getFullYear(), state.viewDate.getMonth(), 1);
      const startOffset = (first.getDay() + 6) % 7;
      const startDate = addDays(first, -startOffset);
      const endDate = addDays(startDate, 41);
      return { start: `${toISO(startDate)}T00:00:00`, end: `${toISO(endDate)}T23:59:59` };
    }

    function getExternalBusyOverlap({ date, time, duration }) {
      const start = new Date(`${date}T${String(time).slice(0,5)}:00`);
      const end = new Date(start.getTime() + Number(duration || 60) * 60000);
      return (state.googleBlockingBusy || []).find(block => {
        const bStart = new Date(block.start);
        const bEnd = new Date(block.end);
        return start < bEnd && end > bStart;
      }) || null;
    }

    async function refreshGoogleBlockingAvailability(force = false) {
      if (!cloud.user || !cloud.google?.connected) {
        state.googleBlockingBusy = [];
        state.googleBlockingBusyKey = '';
        return;
      }
      const range = getVisibleAvailabilityRange();
      const key = `${range.start}|${range.end}`;
      if (!force && state.googleBlockingBusyKey === key) return;
      state.googleBlockingBusyKey = key;
      try {
        const result = await googleApi('google-availability', { method: 'POST', body: range });
        state.googleBlockingBusy = Array.isArray(result.busy) ? result.busy : [];
        if (el.dayModalBackdrop?.classList.contains('show') && state.selectedDay) renderDayModal(state.selectedDay);
        if (state.calendarView === 'week') renderWeekAgenda(getCalendarAnchorDate());
        if (state.calendarView === 'day') renderDayAgenda(state.selectedDay || todayISO());
      } catch (error) {
        console.error(error);
      }
    }

    function updateFreeSessionDoneUi() {
      const rowLabel = document.getElementById('clientFreeSessionDoneLabel');
      const type = el.clientServiceType?.value || 'personal';
      const pkg = getPackage(el.clientPackage?.value);
      const show = type === 'free_session' || isPack99Package(pkg);
      if (rowLabel) rowLabel.style.display = show ? '' : 'none';
    }

    function updateClientServiceUi() {
      const type = el.clientServiceType?.value || 'personal';
      const isPersonal = type === 'personal';
      const isFreeSession = type === 'free_session';
      if (el.clientPackage) el.clientPackage.disabled = !isPersonal;
      if (el.clientPackagePrice) el.clientPackagePrice.disabled = !isPersonal;
      const toggleField = (node, visible) => {
        if (!node) return;
        node.style.display = visible ? '' : 'none';
      };
      toggleField(document.getElementById('clientPackageLabel'), !isFreeSession);
      toggleField(document.getElementById('clientPackagePriceLabel'), !isFreeSession);
      toggleField(document.getElementById('clientPackagePurchasedLabel'), !isFreeSession);
      toggleField(document.getElementById('clientPaymentStatusLabel'), !isFreeSession);
      toggleField(document.getElementById('clientPaymentModeLabel'), !isFreeSession);
      if (el.clientInstallmentsRow) el.clientInstallmentsRow.hidden = isFreeSession || el.clientPaymentMode?.value !== 'installments';
      if (isFreeSession) {
        const freePkg = ensureSpecialPackage('free_session');
        if (el.clientPackage) el.clientPackage.value = freePkg.id;
        if (el.clientPackagePrice) el.clientPackagePrice.value = '0';
        if (el.clientPackagePurchased) el.clientPackagePurchased.value = 'yes';
        if (el.clientPaymentStatus) el.clientPaymentStatus.value = 'paid';
        if (el.clientPaymentMode) el.clientPaymentMode.value = 'included';
        if (el.clientInstallmentsTotal) el.clientInstallmentsTotal.value = '1';
        if (el.clientInstallmentsPaid) el.clientInstallmentsPaid.value = '1';
      }
      updateFreeSessionDoneUi();
      const preview = document.getElementById('packagePreview');
      if (!preview) return;
      if (type === 'free_session') {
        preview.innerHTML = '<strong>FREE SESSION</strong><div class="muted small">1 sola sessione gratuita da fissare.</div>';
        return;
      }
      const pkg = getPackage(el.clientPackage?.value);
      const freeDone = el.clientFreeSessionDone?.value === 'yes';
      if (isPack99Package(pkg)) {
        preview.innerHTML = `<strong>PACK99</strong><div class="muted small">${freeDone ? '3 lezioni personal.' : '1 free session + 3 lezioni personal.'}</div>`;
        return;
      }
      preview.innerHTML = buildPackageSummary(pkg, Number(el.clientPackagePrice?.value || pkg?.totalPrice || 0));
    }

    function getSnapshot() {
      return {
        clients: state.clients,
        packages: state.packages,
        plans: state.plans,
        lessons: state.lessons,
        selectedClientId: state.selectedClientId,
        viewDate: toISO(state.viewDate),
        dismissedAlerts: state.dismissedAlerts || []
      };
    }

    function hasMeaningfulState(payload) {
      return Boolean((payload?.clients || []).length || (payload?.plans || []).length || (payload?.lessons || []).length || (payload?.packages || []).length);
    }

    function persistBackupSnapshot(snapshot) {
      const payload = { ...snapshot, backupAt: new Date().toISOString() };
      try {
        localStorage.setItem(BACKUP_LATEST_KEY, JSON.stringify(payload));
        sessionStorage.setItem(SESSION_BACKUP_KEY, JSON.stringify(payload));
        const history = JSON.parse(localStorage.getItem(BACKUP_HISTORY_KEY) || '[]');
        const now = new Date();
        const todayKey   = now.toISOString().slice(0, 10);
        const weekKey    = `w${Math.floor((now - new Date(now.getFullYear(), 0, 1)) / 604800000)}`;
        // Keep one slot per calendar day (last 7 days) + one per week (last 4 weeks)
        const byDay  = {};
        const byWeek = {};
        history.forEach(item => {
          const d = String(item.backupAt || '').slice(0, 10);
          const diffDays = Math.floor((now - new Date(d)) / 86400000);
          if (diffDays < 7)  byDay[d]  = byDay[d]  || item;
          const w = `w${Math.floor((new Date(d) - new Date(new Date(d).getFullYear(), 0, 1)) / 604800000)}`;
          const diffWeeks = Math.floor((now - new Date(d)) / 604800000);
          if (diffWeeks < 4) byWeek[w] = byWeek[w] || item;
        });
        byDay[todayKey]  = payload;
        byWeek[weekKey]  = payload;
        const merged = Object.values({ ...byWeek, ...byDay });
        merged.sort((a, b) => String(b.backupAt).localeCompare(String(a.backupAt)));
        localStorage.setItem(BACKUP_HISTORY_KEY, JSON.stringify(merged.slice(0, 11)));
      } catch (error) {
        console.error('persistBackupSnapshot error:', error);
      }
    }

        function saveLocalState() {
      // ATTENZIONE: I dati sensibili dei clienti memorizzati localmente (localStorage)
      // non sono crittografati. Per una sicurezza enterprise, questi dati dovrebbero
      // essere crittografati prima di essere salvati e decrittografati al recupero.
      // Considerare l'uso di IndexedDB con crittografia per dati offline sensibili.
      const snapshot = getSnapshot();
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
        persistBackupSnapshot(snapshot);
      } catch (error) {
        if (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
          showToast('Spazio locale esaurito. Esporta un backup per liberare spazio.', 'error');
          console.error('localStorage quota exceeded:', error);
        } else {
          console.error('saveLocalState error:', error);
        }
      }
    }

    function getBackupSnapshot() {
      const candidates = [
        localStorage.getItem(BACKUP_LATEST_KEY),
        sessionStorage.getItem(SESSION_BACKUP_KEY)
      ];
      try {
        const history = JSON.parse(localStorage.getItem(BACKUP_HISTORY_KEY) || '[]');
        history.forEach(item => candidates.push(JSON.stringify(item)));
      } catch (error) {
        console.error(error);
      }
      for (const raw of candidates) {
        if (!raw) continue;
        try {
          const parsed = JSON.parse(raw);
          if (hasMeaningfulState(parsed) || (parsed?.packages || []).length) return parsed;
        } catch (error) {
          console.error(error);
        }
      }
      return null;
    }

    function loadSupabaseConfig() {
            // In un ambiente di produzione, queste credenziali dovrebbero essere caricate in modo sicuro
      // da un endpoint server-side (es. Netlify Function) o da variabili d'ambiente.
      // Per ora, usiamo i valori di fallback (vuoti) che verranno sovrascritti dal config remoto.
      return { url: DEFAULT_SUPABASE_URL, key: DEFAULT_SUPABASE_ANON_KEY };
    }

    function persistSupabaseConfig(config) {
      cloud.config = config || { url: DEFAULT_SUPABASE_URL, key: DEFAULT_SUPABASE_ANON_KEY };
    }

    function updateAuthMessage(message) {
      el.authMessage.textContent = message;
    }

    function updateSyncBadge(message) {
      el.syncBadge.textContent = message;
      el.cloudStatusLabel.textContent = message;
      const dot = document.getElementById('cloudDot');
      if (dot) {
        const msg = message.toLowerCase();
        const isSyncing = msg.includes('sincroniz') || msg.includes('caricamento');
        const isOnline  = msg.includes('salvato') || msg.includes('caricato') || msg.includes('completat') || msg.includes('aggiornato');
        const isError   = msg.includes('errore') || msg.includes('non riuscit') || msg.includes('disattivato') || msg.includes('non configurato') || msg.includes('troppo grandi');
        const isWarn    = msg.includes('locale') || msg.includes('offline') || msg.includes('attesa') || msg.includes('login');
        dot.classList.toggle('syncing', isSyncing);
        dot.style.background = isSyncing ? '' : isOnline ? '#1db954' : isError ? '#ef4444' : isWarn ? '#f59e0b' : 'rgba(255,255,255,0.25)';
        dot.title = message;
      }
      const banner = document.getElementById('offlineBanner');
      if (banner) {
        const isErr = message.toLowerCase().includes('errore') || message.toLowerCase().includes('non riuscit');
        banner.classList.toggle('show', isErr);
      }
    }

    function updateUserBadge() {
      const email = cloud.user?.email || 'Non connesso';
      el.userBadge.textContent = email;
      el.cloudUserEmail.textContent = email;
      document.body.classList.toggle('signed-out', !cloud.user && !cloud.allowLocalOnly);
    }

    function populateCloudConfigInputs() {
      const cfg = cloud.config || loadSupabaseConfig();
      if (el.sbProjectUrl) el.sbProjectUrl.value = cfg.url || '';
      if (el.sbAnonKey) el.sbAnonKey.value = cfg.key || '';
      if (el.cloudProjectUrl) el.cloudProjectUrl.value = cfg.url || '';
      if (el.cloudAnonKey) el.cloudAnonKey.value = cfg.key || '';
      if (el.supabaseConfigStatus) el.supabaseConfigStatus.textContent = 'Cloud collegato. Accedi o registrati.';
    }

    function initSupabaseClient(config) {
      if (!config?.url || !config?.key) {
        cloud.client = null;
        return false;
      }
      if (!window.supabase?.createClient) {
        console.error('[DSWORLD] Libreria Supabase non caricata.');
        cloud.client = null;
        updateSyncBadge('Errore libreria Supabase');
        return false;
      }
      try {
        cloud.config = config;
        const client = window.supabase.createClient(config.url, config.key);
        if (!client || !client.auth) {
          console.error('[DSWORLD] Client Supabase non valido o incompleto.');
          cloud.client = null;
          updateSyncBadge('Errore inizializzazione cloud');
          return false;
        }
        cloud.client = client;
        cloud.allowLocalOnly = false;
        populateCloudConfigInputs();
        updateSyncBadge('Cloud pronto');
        return true;
      } catch (err) {
        console.error('[DSWORLD] Errore createClient:', err);
        cloud.client = null;
        updateSyncBadge('Errore inizializzazione cloud');
        return false;
      }
    }

    async function syncStateToCloud(force = false) {
      if (!cloud.client || !cloud.user || cloud.allowLocalOnly) return false;
      if (cloud.saving && !force) return false;
      cloud.saving = true;
      updateSyncBadge('Sincronizzazione...');
      const payload = getSnapshot();
      const payloadStr = JSON.stringify(payload);
      if (payloadStr.length > 4 * 1024 * 1024) {
        cloud.saving = false;
        updateSyncBadge('Dati troppo grandi');
        showToast('I dati superano il limite cloud. Esporta un backup.', 'error');
        return false;
      }
      const { error } = await cloud.client
        .from('user_app_state')
        .upsert({ user_id: cloud.user.id, app_data: payload, updated_at: new Date().toISOString() });
      cloud.saving = false;
      if (error) {
        console.error('syncStateToCloud error:', error);
        /* Granular error handling */
        if (error.status === 401 || error.message?.includes('JWT') || error.message?.includes('token')) {
          updateSyncBadge('Sessione scaduta');
          showToast('Sessione scaduta — effettua di nuovo il login.', 'warn');
        } else if (error.status === 403) {
          updateSyncBadge('Accesso negato');
          showToast('Permesso negato dal cloud. Contatta il supporto.', 'error');
        } else if (error.status === 0 || error.message?.includes('network') || error.message?.includes('fetch')) {
          updateSyncBadge('Offline');
          showToast('Nessuna connessione. I dati sono salvati in locale.', 'warn');
        } else if (error.status >= 500) {
          updateSyncBadge('Errore server');
          showToast('Errore server cloud. Riprova tra qualche secondo.', 'error');
        } else {
          updateSyncBadge('Errore cloud');
          showToast('Sync cloud non riuscita.', 'error');
        }
        return false;
      }
      updateSyncBadge('Cloud salvato');
      return true;
    }

    function queueCloudSave(urgent = false) {
      if (!cloud.client || !cloud.user || cloud.allowLocalOnly) return;
      clearTimeout(cloud.saveTimer);
      const delay = urgent ? 800 : 2500;
      cloud.saveTimer = setTimeout(() => { syncStateToCloud().catch(err => console.error('Cloud save failed:', err)); }, delay);
    }

    function saveState(urgent = false) {
      invalidateDerivedData();
      saveLocalState();
      queueCloudSave(urgent);
    }

    function applySnapshot(parsed) {
      state.clients = Array.isArray(parsed.clients) ? parsed.clients : [];
      state.packages = Array.isArray(parsed.packages) ? parsed.packages : [];
      normalizePackageData();
      state.plans = Array.isArray(parsed.plans) ? parsed.plans : [];
      state.lessons = Array.isArray(parsed.lessons) ? parsed.lessons : [];
      invalidateDerivedData();
      state.selectedClientId = parsed.selectedClientId || null;
      state.viewDate = parsed.viewDate ? startOfMonth(fromISO(parsed.viewDate)) : startOfMonth(new Date());
      state.dismissedAlerts = Array.isArray(parsed.dismissedAlerts) ? parsed.dismissedAlerts : [];

      let normalizedPlans = false;
      state.plans.forEach(plan => {
        const normalized = normalizeCheckMode(plan.checkMode);
        if (plan.checkMode !== normalized) {
          plan.checkMode = normalized;
          normalizedPlans = true;
        }
      });

      if (!state.packages.length) state.packages = seedPackages();
      if (!state.selectedClientId || !getClient(state.selectedClientId)) state.selectedClientId = getDefaultSelectedClientId(state.selectedClientId);
      if (normalizedPlans) saveLocalState();
    }

    function loadStateLocal() {
      let loaded = false;
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          applySnapshot(JSON.parse(raw));
          loaded = true;
        } else {
          const legacy = localStorage.getItem(LEGACY_KEY);
          if (legacy) {
            const migrated = migrateLegacy(JSON.parse(legacy));
            applySnapshot(migrated);
            saveLocalState();
            loaded = true;
          }
        }
      } catch (error) {
        console.error(error);
      }
      if (!loaded) {
        const backup = getBackupSnapshot();
        if (backup) {
          applySnapshot(backup);
          saveLocalState();
          showToast('Ripristino automatico del backup locale.', 'warn');
        }
      }
      if (!state.packages.length) state.packages = seedPackages();
      if (!state.selectedClientId || !getClient(state.selectedClientId)) state.selectedClientId = getDefaultSelectedClientId(state.selectedClientId);
      /* Genera shareToken per clienti esistenti che non ce l'hanno */
      let needsSave = false;
      state.clients.forEach(c => { if (!c.shareToken) { c.shareToken = generateShareToken(); needsSave = true; } });
      if (needsSave) saveLocalState();
    }

    async function hydrateStateFromCloud() {
      if (!cloud.client || !cloud.user || cloud.allowLocalOnly) return false;
      updateSyncBadge('Caricamento cloud...');
      const { data, error, status } = await cloud.client
        .from('user_app_state')
        .select('app_data, updated_at')
        .eq('user_id', cloud.user.id)
        .maybeSingle();

      if (error && status !== 406) {
        console.error('hydrateStateFromCloud error:', error);
        if (status === 401 || error.message?.includes('JWT')) {
          updateSyncBadge('Sessione scaduta');
          showToast('Sessione scaduta — effettua di nuovo il login.', 'warn');
        } else if (!navigator.onLine || status === 0) {
          updateSyncBadge('Offline — dati locali');
          showToast('Nessuna connessione. Usando dati locali.', 'warn');
        } else {
          updateSyncBadge('Errore caricamento');
          showToast('Impossibile caricare i dati cloud.', 'error');
        }
        return false;
      }

      if (data?.app_data) {
        applySnapshot(data.app_data);
        saveLocalState();
        updateSyncBadge('Cloud caricato');
        return true;
      }

      if (hasMeaningfulState(getSnapshot())) {
        await syncStateToCloud(true);
      } else {
        if (!state.packages.length) state.packages = seedPackages();
        saveLocalState();
        await syncStateToCloud(true);
      }
      return false;
    }

    async function handleSession(session) {
      const previousUserId = cloud.user?.id || null;
      cloud.session = session || null;
      cloud.user = session?.user || null;

      /* Se l'utente cambia (logout + login con altro account), pulisci
         immediatamente tutto il localStorage e lo stato in memoria.
         Previene che i dati di un trainer finiscano in un altro account. */
      const newUserId = cloud.user?.id || null;
      if (previousUserId && newUserId && previousUserId !== newUserId) {
        try {
          localStorage.removeItem(STORAGE_KEY);
          localStorage.removeItem(BACKUP_LATEST_KEY);
          localStorage.removeItem(BACKUP_HISTORY_KEY);
          sessionStorage.removeItem(SESSION_BACKUP_KEY);
        } catch (_) {}
        state.clients  = [];
        state.plans    = [];
        state.lessons  = [];
        state.packages = [];
        state.selectedClientId = null;
      }

      updateUserBadge();
      if (!cloud.user) {
        resetGoogleState();
        updateSyncBadge(cloud.allowLocalOnly ? 'Solo cache locale' : 'Login richiesto');
        /* Rimuovi canale realtime se logout */
        if (_realtimeChannel && cloud.client) {
          cloud.client.removeChannel(_realtimeChannel);
          _realtimeChannel = null;
        }
        updateMsgBadges(0);
        renderAll();
        return;
      }
      await hydrateStateFromCloud();
      await refreshGoogleStatus();
      /* Riavvia Realtime per il nuovo utente */
      refreshUnreadMessages();
      initRealtimeMessages();
      renderAll();
    }

    async function ensureSupabaseReady() {
      populateCloudConfigInputs();
      if (cloud.allowLocalOnly) {
        updateSyncBadge('Solo cache locale');
        updateUserBadge();
        resetGoogleState();
        return false;
      }
      const config = loadSupabaseConfig();
      if (!config?.url || !config?.key) {
        updateSyncBadge('Cloud non configurato');
        updateUserBadge();
        resetGoogleState();
        return false;
      }
      const ready = initSupabaseClient(config);
      if (!ready || !cloud.client?.auth) {
        console.error('[DSWORLD] Client cloud non disponibile dopo initSupabaseClient.');
        updateUserBadge();
        resetGoogleState();
        return false;
      }
      if (!cloud.listenerBound) {
        cloud.client.auth.onAuthStateChange((event, session) => {
          if (event === 'PASSWORD_RECOVERY') handlePasswordRecovery(session);
          handleSession(session);
        });
        cloud.listenerBound = true;
      }
      const { data, error } = await cloud.client.auth.getSession();
      if (error) console.error(error);
      await handleSession(data?.session || null);
      return true;
    }

    function getAuthToken() {
      return cloud.session?.access_token || '';
    }

    function clearUrlParams(keys = []) {
      const url = new URL(window.location.href);
      let changed = false;
      keys.forEach(key => {
        if (url.searchParams.has(key)) {
          url.searchParams.delete(key);
          changed = true;
        }
      });
      if (changed) window.history.replaceState({}, document.title, url.toString());
    }

    function resetGoogleState() {
      cloud.google = {
        connected: false,
        calendarId: '',
        calendarName: '',
        googleEmail: '',
        lastError: '',
        lastSyncAt: '',
        syncing: false
      };
      updateGoogleUi();
    }

    function updateGoogleUi() {
      const loggedIn = Boolean(cloud.user);
      const connected = Boolean(cloud.google?.connected);
      const baseStatus = !loggedIn ? 'Accedi prima' : connected ? 'Connesso' : 'Non collegato';
      if (el.googleStatusLabel) el.googleStatusLabel.textContent = cloud.google?.syncing ? 'Sync in corso' : baseStatus;
      let hint = 'Accedi per collegare Google Calendar.';
      if (loggedIn && connected) {
        const parts = [cloud.google.calendarName || 'DSWORLD Clienti'];
        if (cloud.google.googleEmail) parts.push(cloud.google.googleEmail);
        parts.push('sync automatica attiva');
        hint = parts.join(' • ');
      } else if (loggedIn) {
        hint = 'Collega Google per creare e sincronizzare automaticamente il calendario DSWORLD Clienti. Gli altri calendari Google selezionati sul tuo account bloccano gli slot non disponibili.';
      }
      if (cloud.google?.lastError) hint = `${hint} • ${cloud.google.lastError}`;
      if (el.googleStatusHint) el.googleStatusHint.textContent = hint;
      if (el.connectGoogleBtn) el.connectGoogleBtn.textContent = connected ? 'Ricollega Google Calendar' : 'Collega Google Calendar';
      if (el.googleResyncBtn) el.googleResyncBtn.disabled = !loggedIn || !connected || cloud.google?.syncing;
      if (el.disconnectGoogleBtn) el.disconnectGoogleBtn.disabled = !loggedIn || !connected || cloud.google?.syncing;
    }

    async function googleApi(path, { method = 'GET', body = null } = {}) {
      const token = getAuthToken();
      if (!token) throw new Error('Login richiesto.');
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      try {
        const cacheBust = path === 'google-status' ? `?_=${Date.now()}` : '';
        const response = await fetch(`${GOOGLE_FN_BASE}/${path}${cacheBust}`, {
          method,
          headers: {
            'Authorization': `Bearer ${token}`,
            ...(body ? { 'Content-Type': 'application/json' } : {})
          },
          body: body ? JSON.stringify(body) : undefined,
          signal: controller.signal
        });
        let payload = {};
        try { payload = await response.json(); } catch (error) { payload = {}; }
        if (!response.ok) throw new Error(payload.error || payload.message || `HTTP ${response.status}`);
        return payload;
      } finally {
        clearTimeout(timeoutId);
      }
    }

    async function refreshGoogleStatus() {
      if (!cloud.user || !cloud.client || cloud.allowLocalOnly) {
        resetGoogleState();
        return false;
      }
      try {
        const data = await googleApi('google-status');
        cloud.google.connected = Boolean(data.connected);
        cloud.google.calendarId = data.calendarId || '';
        cloud.google.calendarName = data.calendarName || 'DSWORLD Clienti';
        cloud.google.googleEmail = data.googleEmail || '';
        cloud.google.lastError = '';
      } catch (error) {
        console.error(error);
        cloud.google.connected = false;
        cloud.google.calendarId = '';
        cloud.google.calendarName = '';
        cloud.google.googleEmail = '';
        cloud.google.lastError = 'stato Google non disponibile';
      }
      updateGoogleUi();
      return cloud.google.connected;
    }

    function buildGoogleSyncPayload(lessonLike) {
      const lessonId = lessonLike?.id || lessonLike;
      const lesson = getLesson(lessonId) || (typeof lessonLike === 'object' ? lessonLike : null);
      if (!lesson) return null;
      const client = getClient(lesson.clientId);
      const plan = getPlan(lesson.planId);
      const pkg = getPackage(plan?.packageId);
      return {
        ...lesson,
        googleEventId: lesson.googleEventId || lessonLike?.googleEventId || '',
        clientName: lesson.clientName || getClientFullName(client) || 'Cliente',
        clientEmail: client?.email || '',
        sendCalendarInvite: !!(client?.sendCalendarInvite === true || client?.sendCalendarInvite === 'yes'),
        clientNotes: lesson.clientNotes || client?.notes || '',
        packageName: lesson.packageName || pkg?.name || '',
        serviceType: getLessonServiceType(lesson, client),
        clientServiceType: getClientServiceType(client),
        planStartDate: lesson.planStartDate || plan?.startDate || '',
        calendarTimeZone: 'Europe/Rome'
      };
    }

    function queueGoogleTask(task, { silent = true } = {}) {
      if (!cloud.googleQueue) cloud.googleQueue = Promise.resolve();
      cloud.googleQueue = cloud.googleQueue.then(task).catch(error => {
        console.error(error);
        cloud.google.lastError = error.message || 'errore sync Google';
        updateGoogleUi();
        if (!silent) showToast('Sync Google non riuscita.', 'error');
      });
      return cloud.googleQueue;
    }

    function shouldSkipGoogleCreateForLesson(action, payload, { allowCreateWithoutEventId = false } = {}) {
      if (!payload) return true;
      const isDelete = action === 'delete';
      const isTerminalStatus = payload.status === 'done' || payload.status === 'cancelled';
      if ((isDelete || isTerminalStatus) && !payload.googleEventId && !allowCreateWithoutEventId) {
        console.warn('[DSWORLD Google Sync] Sync evitata per lezione senza googleEventId:', payload.id, 'azione:', action, 'stato:', payload.status);
        return true;
      }
      return false;
    }

    async function requestGoogleLessonSync(action, lessonLike, { silent = true, allowCreateWithoutEventId = false } = {}) {
      if (!cloud.user || !cloud.google?.connected) return { skipped: true };
      const isDelete = action === 'delete';

      // FIX: per le azioni di DELETE il payload va costruito SUBITO (la lezione viene rimossa
      // dallo stato prima di questa chiamata, quindi non sarebbe più disponibile dopo).
      // Per tutte le altre azioni (upsert ecc.) il payload viene costruito DENTRO il task in coda,
      // così legge sempre il googleEventId aggiornato dal task precedente ed evita duplicati su Google Calendar.
      const eagerPayload = isDelete ? buildGoogleSyncPayload(lessonLike) : null;
      if (isDelete) {
        if (!eagerPayload) return { skipped: true };
        if (shouldSkipGoogleCreateForLesson(action, eagerPayload, { allowCreateWithoutEventId })) return { skipped: true, reason: 'missing_google_event_id' };
      }

      return queueGoogleTask(async () => {
        // Costruzione payload lazy per upsert: in questo momento il task precedente in coda
        // ha già salvato il googleEventId reale, quindi il payload sarà sempre aggiornato.
        const payload = isDelete ? eagerPayload : buildGoogleSyncPayload(lessonLike);
        if (!payload) return { skipped: true };
        if (!isDelete && shouldSkipGoogleCreateForLesson(action, payload, { allowCreateWithoutEventId })) return { skipped: true, reason: 'missing_google_event_id' };

        cloud.google.syncing = true;
        cloud.google.lastError = '';
        updateGoogleUi();
        const result = await googleApi('google-sync', { method: 'POST', body: { action, lesson: payload } });
        cloud.google.syncing = false;
        cloud.google.lastSyncAt = new Date().toISOString();
        cloud.google.lastError = '';
        if (action !== 'delete' && result?.googleEventId) {
          const liveLesson = getLesson(payload.id);
          if (liveLesson && liveLesson.googleEventId !== result.googleEventId) {
            liveLesson.googleEventId = result.googleEventId;
            saveState();
          }
        }
        if (result?.calendarName) cloud.google.calendarName = result.calendarName;
        updateGoogleUi();
        return result;
      }, { silent: isDelete ? false : silent });
    }

    async function syncAllLessonsToGoogle(showToastOnSuccess = true) {
      if (!cloud.user) {
        showToast('Accedi prima.');
        return false;
      }
      if (!cloud.google?.connected) {
        showToast('Collega Google Calendar.');
        return false;
      }
      const lessons = state.lessons.map(item => buildGoogleSyncPayload(item)).filter(Boolean);
      cloud.google.syncing = true;
      cloud.google.lastError = '';
      updateGoogleUi();
      try {
        const result = await googleApi('google-replay-sync', { method: 'POST', body: { lessons } });
        let changed = false;
        (result.mappings || []).forEach(mapping => {
          const lesson = getLesson(mapping.id);
          if (lesson && mapping.googleEventId && lesson.googleEventId !== mapping.googleEventId) {
            lesson.googleEventId = mapping.googleEventId;
            changed = true;
          }
        });
        if (changed) saveState();
        cloud.google.lastSyncAt = new Date().toISOString();
        updateGoogleUi();
        if (showToastOnSuccess) showToast(`Google aggiornato: ${result.synced || 0} lezioni.`);
        return true;
      } catch (error) {
        console.error(error);
        cloud.google.lastError = error.message || 'errore sync Google';
        updateGoogleUi();
        showToast('Sync Google non riuscita.', 'error');
        return false;
      } finally {
        cloud.google.syncing = false;
        updateGoogleUi();
      }
    }

    async function startGoogleCalendarConnect() {
      if (!cloud.user) {
        showToast('Accedi prima.');
        return;
      }
      try {
        const result = await googleApi('google-auth-start', {
          method: 'POST',
          body: { returnTo: `${window.location.origin}${window.location.pathname}` }
        });
        if (!result.url) throw new Error('URL Google non disponibile.');
        window.location.href = result.url;
      } catch (error) {
        console.error(error);
        showToast('Connessione Google non riuscita.', 'error');
      }
    }

    async function disconnectGoogleCalendar() {
      if (!cloud.user || !cloud.google?.connected) return;
      try {
        await googleApi('google-disconnect', { method: 'POST' });
        resetGoogleState();
        showToast('Google Calendar scollegato.', 'ok');
      } catch (error) {
        console.error(error);
        showToast('Scollegamento non riuscito.', 'error');
      }
    }

    function migrateLegacy(parsed) {
      const packages = [];
      const packageMap = new Map();
      const clients = [];
      const plans = [];
      const lessons = [];

      function getOrCreateLegacyPackage(client) {
        const key = [client.totalLessons, client.packageWeeks, client.sessionsPerWeek, client.lessonDuration].join('|');
        if (packageMap.has(key)) return packageMap.get(key);
        const pkg = {
          id: uid('pkg'),
          name: `${client.totalLessons} lez / ${client.packageWeeks} sett`,
          lessonsTotal: Number(client.totalLessons || 12),
          weeks: Number(client.packageWeeks || 8),
          perWeek: Number(client.sessionsPerWeek || 2),
          duration: Number(client.lessonDuration || 60),
          totalPrice: Number(client.packagePrice || 0),
          createdAt: client.createdAt || new Date().toISOString()
        };
        packages.push(pkg);
        packageMap.set(key, pkg.id);
        return pkg.id;
      }

      (parsed.clients || []).forEach(oldClient => {
        const packageId = getOrCreateLegacyPackage(oldClient);
        const clientId = oldClient.id || uid('client');
        const planId = uid('plan');
        const clientLessons = (parsed.lessons || []).filter(item => item.clientId === oldClient.id);
        const firstLesson = clientLessons.filter(item => item.status !== 'cancelled').map(item => item.date).sort()[0] || String(oldClient.createdAt || todayISO()).slice(0, 10);
        const legacyName = oldClient.name || 'Cliente';
        const legacyParts = splitFullName(legacyName);
        clients.push({
          id: clientId,
          firstName: legacyParts.firstName,
          lastName: legacyParts.lastName,
          name: legacyName,
          email: '',
          sendCalendarInvite: false,
          notes: oldClient.notes || '',
          serviceType: 'personal',
          freeSessionDone: true,
          packagePurchased: true,
          conversionStatus: 'path_started',
          scheduleMode: oldClient.defaultTime ? 'same' : 'different',
          fixedTime: oldClient.defaultTime || '',
          activePlanId: planId,
          createdAt: oldClient.createdAt || new Date().toISOString()
        });
        plans.push({
          id: planId,
          clientId,
          packageId,
          startDate: firstLesson,
          checkMode: normalizeCheckMode(oldClient.checkMode),
          saleType: 'new',
          createdAt: oldClient.createdAt || new Date().toISOString()
        });
        clientLessons.forEach(oldLesson => lessons.push({
          id: oldLesson.id || uid('lesson'),
          clientId,
          planId,
          date: oldLesson.date,
          time: oldLesson.time,
          duration: Number(oldLesson.duration || oldClient.lessonDuration || 60),
          status: oldLesson.status === 'completed' ? 'done' : oldLesson.status || 'scheduled',
          note: oldLesson.note || '',
          linkedTo: oldLesson.linkedTo || null,
          createdAt: oldLesson.createdAt || new Date().toISOString()
        }));
      });

      return {
        clients,
        packages: packages.length ? packages : seedPackages(),
        plans,
        lessons,
        selectedClientId: clients[0]?.id || null,
        viewDate: toISO(startOfMonth(new Date()))
      };
    }

    function normalizePackageData() {
      state.packages = (state.packages || []).map(pkg => ({ ...pkg, totalPrice: Number(pkg?.totalPrice || 0) }));
    }

    function getClient(id) { return state.clients.find(item => item.id === id) || null; }
    function getPackage(id) { return state.packages.find(item => item.id === id) || null; }
    function getPlan(id) { return state.plans.find(item => item.id === id) || null; }
    function getActivePlan(clientId) {
      const client = getClient(clientId);
      if (!client) return null;
      return getPlan(client.activePlanId) || state.plans.filter(plan => plan.clientId === clientId).sort((a, b) => String(a.createdAt).localeCompare(String(b.createdAt))).slice(-1)[0] || null;
    }
    /* Restituisce il primo piano con slot disponibili (vecchio prima, poi nuovo) */
    function getNextAvailablePlan(clientId) {
      const client = getClient(clientId);
      if (!client) return null;
      const plans = state.plans
        .filter(plan => plan.clientId === clientId)
        .sort((a, b) => String(a.createdAt).localeCompare(String(b.createdAt)));
      for (const plan of plans) {
        const capacity = getPlanCapacity(plan.id);
        if (!capacity.isFull) return plan;
      }
      return plans[plans.length - 1] || null;
    }
    function getLesson(id) { return state.lessons.find(item => item.id === id) || null; }
    function getLessonsForClient(clientId) {
      return state.lessons.filter(item => item.clientId === clientId).sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
    }
    function getLessonsForPlan(planId) {
      return state.lessons.filter(item => item.planId === planId).sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
    }

    function getPlanCapacity(planId) {
      const plan = getPlan(planId);
      const pkg = getPackage(plan?.packageId);
      const total = Number(pkg?.lessonsTotal || 0) + Number(plan?.carryOverLessons || 0) + Number(plan?.bonusLessons || 0);
      const used = getLessonsForPlan(planId).filter(item => item.status !== 'cancelled').length;
      const remaining = Math.max(total - used, 0);
      return { total, used, remaining, isFull: total > 0 && used >= total };
    }

    function canUsePlanSlot(planId, lessonId = null) {
      const plan = getPlan(planId);
      const pkg = getPackage(plan?.packageId);
      const total = Number(pkg?.lessonsTotal || 0) + Number(plan?.carryOverLessons || 0) + Number(plan?.bonusLessons || 0);
      if (!total) return true;
      const used = getLessonsForPlan(planId).filter(item => item.status !== 'cancelled' && item.id !== lessonId).length;
      return used < total;
    }

    function planStats(plan) {
      if (!plan) return { total: 0, done: 0, remaining: 0, firstLesson: null, nextLesson: null, progress: 0, cancelled: 0 };
      const pkg = getPackage(plan.packageId);
      const lessons = getLessonsForPlan(plan.id);
      const done = lessons.filter(item => item.status === 'done').length;
      const cancelled = lessons.filter(item => item.status === 'cancelled').length;
      const effective = lessons.filter(item => item.status !== 'cancelled');
      const firstLesson = effective.map(item => item.date).sort()[0] || null;
      const nextLesson = lessons.filter(item => item.status !== 'cancelled' && item.date >= todayISO()).sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`))[0] || null;
      const base = Number(pkg?.lessonsTotal || 0);
      const carryOver = Number(plan?.carryOverLessons || 0);
      const bonus = Number(plan?.bonusLessons || 0);
      const total = base + carryOver + bonus;
      const remaining = Math.max(total - done, 0);
      const progress = total ? Math.min(100, Math.round((done / total) * 100)) : 0;
      return { total, done, remaining, firstLesson, nextLesson, progress, cancelled, carryOver, bonus };
    }

    function clientHistoryStats(clientId) {
      const lessons = getLessonsForClient(clientId);
      const cancelled = lessons.filter(item => item.status === 'cancelled').length;
      const done = lessons.filter(item => item.status === 'done').length;
      const future = lessons.filter(item => item.status !== 'cancelled' && item.date >= todayISO()).length;
      const lastSeen = lessons.filter(item => item.status !== 'cancelled').map(item => item.date).sort().slice(-1)[0] || null;
      return { lessons, cancelled, done, future, lastSeen };
    }

    function getMonthSnapshot(monthDate) {
      if (!derived.monthSnapshots) derived.monthSnapshots = new Map();
      const key = `${monthDate.getFullYear()}-${monthDate.getMonth()}`;
      if (derived.monthSnapshots.has(key)) return derived.monthSnapshots.get(key);
      const lessons = state.lessons.filter(item => sameMonth(fromISO(item.date), monthDate));
      const done = lessons.filter(item => item.status === 'done').length;
      const cancelled = lessons.filter(item => item.status === 'cancelled').length;
      const scheduled = lessons.filter(item => item.status === 'scheduled').length;
      const total = lessons.filter(item => item.status !== 'cancelled').length;
      const newClients = state.clients.filter(client => sameMonth(new Date(client.createdAt || client.startDate || new Date()), monthDate)).length;
      const revenue = lessons
        .filter(item => item.status === 'done')
        .reduce((sum, lesson) => {
          const plan = getPlan(lesson.planId);
          const pkg = getPackage(plan?.packageId);
          return sum + getPlanUnitValue(plan, pkg, getClient(lesson.clientId), lesson);
        }, 0);
      const snapshot = { lessons, done, cancelled, scheduled, total, newClients, revenue };
      derived.monthSnapshots.set(key, snapshot);
      return snapshot;
    }

    function countFreeSlots(days = 7) {
      const slots = buildDaySlotTimes();
      let free = 0;
      for (let offset = 0; offset < days; offset += 1) {
        const iso = toISO(addDays(new Date(), offset));
        slots.forEach(time => {
          if (!hasTimeConflict({ date: iso, time, duration: 60 })) free += 1;
        });
      }
      return free;
    }

    function getClientHealth(client) {
      const urgency = getClientUrgency(client);
      if (urgency.level === 'bad') return 'Alto rischio';
      if (urgency.level === 'warn') return 'Monitor';
      return 'Regolare';
    }

    function getUrgencyLabel(level) {
      if (level === 'bad') return 'Alto rischio';
      if (level === 'warn') return 'Attenzione';
      return 'Stabile';
    }

    function sessionPerWeekLabel(value) {
      const n = Number(value || 0);
      if (n === 1) return '1 sessione / settimana';
      return `${n} sessioni / settimana`;
    }

    function compactPackageLabel(pkg) {
      if (!pkg) return '—';
      const name = String(pkg.name || '').trim();
      const weeks = Number(pkg.weeks || 0);
      if (weeks > 0 && !/settiman/i.test(name)) return `${name} · ${weeks} settimane`;
      return name || '—';
    }

    function getDeltaMeta(current, previous, reverse = false) {
      const delta = Number(current || 0) - Number(previous || 0);
      const direction = delta === 0 ? 'flat' : ((delta > 0) !== reverse ? 'up' : 'down');
      const sign = delta > 0 ? '+' : '';
      return {
        delta,
        direction,
        text: delta === 0 ? 'In linea' : `${sign}${formatNumberMax2(delta)} vs mese prec.`,
      };
    }

    function getUsualTimes(clientId) {
      const client = getClient(clientId);
      const counts = new Map();
      getLessonsForClient(clientId).filter(item => item.status !== 'cancelled').forEach(lesson => {
        counts.set(lesson.time, (counts.get(lesson.time) || 0) + 1);
      });
      if (client?.fixedTime) counts.set(client.fixedTime, (counts.get(client.fixedTime) || 0) + 0.5);
      return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(entry => entry[0]);
    }

    function getUsualWeekdays(clientId) {
      const counts = new Map();
      getLessonsForClient(clientId).filter(item => item.status !== 'cancelled').forEach(lesson => {
        const weekday = normalizeWeekday(fromISO(lesson.date).getDay());
        counts.set(weekday, (counts.get(weekday) || 0) + 1);
      });
      return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(entry => entry[0]);
    }

    function getPreferredTime(clientId) {
      const client = getClient(clientId);
      if (client?.scheduleMode === 'same' && client.fixedTime) return client.fixedTime;
      return getUsualTimes(clientId)[0] || '';
    }

    function getOverlappingLesson({ lessonId = null, date, time, duration, duoGroupId = null }) {
      const start = minutesFromTime(time);
      const end = start + Number(duration || 0);
      return state.lessons.find(lesson => {
        if (lesson.id === lessonId) return false;
        if (lesson.date !== date || lesson.status === 'cancelled') return false;
        // Due lezioni dello stesso gruppo DUO possono coesistere nello stesso slot
        if (duoGroupId && lesson.duoGroupId === duoGroupId) return false;
        const otherStart = minutesFromTime(lesson.time);
        const otherEnd = otherStart + Number(lesson.duration || 60);
        return start < otherEnd && end > otherStart;
      }) || null;
    }

    function hasTimeConflict({ lessonId = null, date, time, duration, duoGroupId = null }) {
      return Boolean(getOverlappingLesson({ lessonId, date, time, duration, duoGroupId }) || getExternalBusyOverlap({ date, time, duration }));
    }

    function addMinutesToTime(time, minutesToAdd) {
      const total = minutesFromTime(time) + Number(minutesToAdd || 0);
      const normalized = ((total % 1440) + 1440) % 1440;
      const hours = Math.floor(normalized / 60);
      const minutes = normalized % 60;
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    }

    function buildDaySlotTimes() {
      const slots = [];
      for (let minutes = 6 * 60; minutes <= 22 * 60; minutes += 30) {
        slots.push(`${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`);
      }
      return slots;
    }

    function getLessonEndDate(lesson) {
      const start = fromISO(lesson.date);
      const [hours, minutes] = String(lesson.time || '00:00').split(':').map(Number);
      start.setHours(Number.isFinite(hours) ? hours : 0, Number.isFinite(minutes) ? minutes : 0, 0, 0);
      return new Date(start.getTime() + Number(lesson.duration || 60) * 60000);
    }

    function autoCompleteElapsedLessons() {
      const now = new Date();
      let changed = false;
      const changedLessons = [];
      state.lessons.forEach(lesson => {
        if (lesson.status !== 'scheduled') return;
        if (getLessonEndDate(lesson) <= now) {
          lesson.status = 'done';
          changedLessons.push(lesson.id);
          changed = true;
        }
      });
      if (changed) {
        saveState();
        if (!_rendering) renderAfterLessonChange();
        changedLessons.forEach(id => requestGoogleLessonSync('upsert', id));
        /* Free session auto-completata → proponi conversione se nessun modal è aperto */
        const noModal = !document.querySelector('.modal-backdrop.open, .confirm-modal-backdrop.open, .fsc-backdrop.open');
        if (noModal) {
          changedLessons.forEach(id => {
            const lesson = getLesson(id);
            if (!lesson) return;
            const client = getClient(lesson.clientId);
            if (client && getClientServiceType(client) === 'free_session' && client.conversionStatus !== 'path_started') {
              setTimeout(() => openFreeSessionConversionModal(client), 800);
            }
          });
        }
      }
      return changed;
    }

    function getAlerts() {
      if (derived.alerts) return derived.alerts;
      const alerts = [];
      const today = todayISO();
      state.clients.forEach(client => {
        const activePlan = getActivePlan(client.id);
        const stats = planStats(activePlan);
        const managed = isManagedClient(client);
        if (managed && activePlan && stats.firstLesson) {
          const first = fromISO(stats.firstLesson);
          if (activePlan.checkMode === '8') {
            const due = toISO(addWeeks(first, 8));
            if (due <= today) alerts.push({ type: 'check', clientId: client.id, text: `Check 8 settimane`, when: due });
          }
          if (activePlan.checkMode === '12') {
            const due = toISO(addWeeks(first, 12));
            if (due <= today) alerts.push({ type: 'check', clientId: client.id, text: `Check 12 settimane`, when: due });
          }
        }
        if (managed && stats.remaining > 0 && stats.remaining <= 3) {
          alerts.push({ type: 'renewal', clientId: client.id, text: `Restano ${stats.remaining} lezioni`, when: stats.nextLesson?.date || today });
        }
        if (managed && (client.paymentStatus || 'unpaid') !== 'paid') {
          const planStartDate = activePlan?.startDate || null;
          if (!planStartDate || planStartDate <= today) {
            // Piano già iniziato → alert pagamento urgente
            const paymentText = client.paymentStatus === 'partial' ? 'Pagamento parziale da chiudere' : 'Pagamento da incassare';
            alerts.push({ type: 'payment', clientId: client.id, text: paymentText, when: stats.nextLesson?.date || planStartDate || today });
          } else {
            // Piano non ancora iniziato → avviso soft, non urgente
            alerts.push({ type: 'check', clientId: client.id, text: `Pacchetto inizia il ${formatDateFancy(planStartDate)} — incasso da gestire`, when: planStartDate });
          }
        }
        const history = clientHistoryStats(client.id);
        if (history.lastSeen) {
          const lastDate = fromISO(history.lastSeen);
          const diffDays = Math.floor((new Date().setHours(0,0,0,0) - lastDate.setHours(0,0,0,0)) / 86400000);
          if (diffDays >= 60 && history.future === 0) {
            const text = managed ? 'Follow-up dopo 2 mesi' : 'Ricontatto free session';
            alerts.push({ type: 'followup', clientId: client.id, text, when: history.lastSeen });
          }
        } else if (!managed && stats.future === 0) {
          alerts.push({ type: 'followup', clientId: client.id, text: 'Free session da ricontattare', when: client.createdAt || today });
        }
      });
      const dismissed = Array.isArray(state.dismissedAlerts) ? state.dismissedAlerts : [];
      derived.alerts = alerts
        .map(a => {
          const c = state.clients.find(cl => cl.id === a.clientId);
          const plan = c ? getActivePlan(c.id) : null;
          const st = plan ? planStats(plan) : {};
          let stateKey = a.when || '';
          if (a.type === 'payment') stateKey = c?.paymentStatus || 'unpaid';
          if (a.type === 'renewal') stateKey = String(st.remaining ?? '');
          if (a.type === 'check')   stateKey = plan?.checkMode || '';
          return { ...a, alertId: `${a.type}_${a.clientId}_${stateKey}` };
        })
        .filter(a => !dismissed.includes(a.alertId))
        .sort((a, b) => String(a.when).localeCompare(String(b.when)));
      return derived.alerts;
    }


    function getClientTimelineEntries(client) {
      if (!client) return [];
      const plan = getActivePlan(client.id);
      const stats = planStats(plan);
      const history = clientHistoryStats(client.id);
      const renewals = Array.isArray(client.renewalHistory) ? client.renewalHistory : [];
      const payments = Array.isArray(client.paymentHistory) ? client.paymentHistory : [];
      const entries = [];
      entries.push({
        tone: stats.nextLesson ? 'info' : 'warn',
        title: stats.nextLesson ? `Prossima sessione ${formatDateFancy(stats.nextLesson.date)} · ${stats.nextLesson.time}` : 'Nessuna sessione futura pianificata',
        text: stats.nextLesson ? 'Agenda già fissata' : 'Serve una nuova prenotazione'
      });
      entries.push({
        tone: history.lastSeen ? 'good' : 'warn',
        title: history.lastSeen ? `Ultima presenza ${formatDateFancy(history.lastSeen)}` : 'Nessuna presenza registrata',
        text: history.lastSeen ? `${history.done} sessioni completate` : 'Cliente ancora da attivare'
      });
      entries.push({
        tone: client.paymentStatus === 'paid' ? 'good' : client.paymentStatus === 'partial' ? 'warn' : 'bad',
        title: getPaymentStatusLabel(client.paymentStatus || 'unpaid'),
        text: payments.length ? `Ultimo movimento ${formatDateFancy(payments[payments.length - 1].at || payments[payments.length - 1].date || todayISO())}` : 'Nessuno storico pagamenti'
      });
      if (renewals.length) {
        const lastRenewal = renewals[renewals.length - 1];
        entries.push({
          tone: 'info',
          title: `Ultimo rinnovo ${formatDateFancy(lastRenewal.at || lastRenewal.startDate || todayISO())}`,
          text: compactPackageLabel(getPackage(lastRenewal.packageId)) || 'Pacchetto rinnovato'
        });
      } else {
        entries.push({
          tone: stats.remaining <= 3 ? 'warn' : 'info',
          title: stats.remaining <= 3 ? `Restano ${stats.remaining} lezioni` : 'Percorso in corso',
          text: stats.remaining <= 3 ? 'Momento giusto per proporre rinnovo' : 'Nessuna azione urgente sul rinnovo'
        });
      }
      return entries.slice(0, 4);
    }

    function getOperationalActionCards() {
      const alerts = getAlerts();
      const upcomingLesson = state.lessons
        .filter(item => item.status === 'scheduled' && `${item.date}T${item.time}` >= `${todayISO()}T00:00`)
        .sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`))[0];
      const unpaid = state.clients.find(client => isManagedClient(client) && (client.paymentStatus || 'unpaid') !== 'paid');
      const expiring = state.clients
        .filter(client => {
          const plan = getActivePlan(client.id);
          const stats = planStats(plan);
          return isManagedClient(client) && stats.remaining > 0 && stats.remaining <= 3;
        })
        .sort((a, b) => planStats(getActivePlan(a.id)).remaining - planStats(getActivePlan(b.id)).remaining)[0];
      const followup = alerts.find(item => item.type === 'followup');
      const unpaidCount = state.clients.filter(c => isManagedClient(c) && (c.paymentStatus || 'unpaid') !== 'paid').length;
      return [
        upcomingLesson ? {
          tone: 'info',
          label: 'Prossima lezione',
          value: getClientFullName(getClient(upcomingLesson.clientId)) || 'Sessione pianificata',
          sub: `${formatDateFancy(upcomingLesson.date)} · ${upcomingLesson.time}`,
          meta: 'Apri giorno',
          action: 'open-day',
          clientId: upcomingLesson.clientId,
          date: upcomingLesson.date
        } : {
          tone: 'good',
          label: 'Prossima lezione',
          value: 'Agenda libera',
          sub: 'Nessuna sessione imminente',
          meta: 'Nuova prenotazione',
          action: 'new-client'
        },
        unpaidCount > 0 ? {
          tone: 'danger',
          label: 'Clienti a rischio',
          value: `${unpaidCount} client${unpaidCount === 1 ? 'e' : 'i'}`,
          sub: 'Pagamenti non saldati',
          meta: 'Apri lista',
          action: 'open-at-risk'
        } : {
          tone: 'good',
          label: 'Clienti a rischio',
          value: 'Tutto saldato',
          sub: 'Nessun incasso aperto',
          meta: 'OK',
          action: 'noop'
        }
      ];
    }

    function focusClient(clientId) {
      const client = getClient(clientId);
      if (!client) return null;
      state.selectedClientId = client.id;
      const next = planStats(getActivePlan(client.id)).nextLesson;
      if (next?.date) {
        state.selectedDay = next.date;
        state.viewDate = startOfMonth(fromISO(next.date));
      }
      return client;
    }

    function handleOperationalAction(button) {
      const action = button.getAttribute('data-action');
      const clientId = button.getAttribute('data-client-id');
      const date = button.getAttribute('data-date');
      if (clientId) focusClient(clientId);
      if (action === 'renew' && clientId) {
        saveState();
        renderAfterClientFocus();
        openRenewModal();
        return;
      }
      if (action === 'open-client' && clientId) {
        saveState();
        renderAfterClientFocus();
        return;
      }
      if (action === 'open-day' && date) {
        state.selectedDay = date;
        state.viewDate = startOfMonth(fromISO(date));
        state.calendarView = 'day';
        saveState();
        renderAfterCalendarNavigation();
        return;
      }
      if (action === 'new-client') {
        openNewClientModal(button);
        return;
      }
      if (action === 'open-at-risk') {
        renderAtRiskModal();
        openModal('atRiskModalBackdrop');
        return;
      }
    }

    function quickBookSelectedClient(offsetDays = 0) {
      const client = getClient(state.selectedClientId);
      if (!client) {
        showToast('Seleziona un cliente.');
        return;
      }
      const plan = getNextAvailablePlan(client.id);
      const pkg = getPackage(plan?.packageId);
      if (!plan || !pkg) {
        showToast('Pacchetto mancante.');
        return;
      }
      const targetDate = toISO(addDays(new Date(), offsetDays));
      const preferredTime = getPreferredTime(client.id) || client.fixedTime || '09:00';
      if (!hasTimeConflict({ date: targetDate, time: preferredTime, duration: pkg.duration })) {
        const ok = createLesson({ clientId: client.id, planId: plan.id, date: targetDate, time: preferredTime, duration: pkg.duration, setFixedTime: client.scheduleMode === 'same' });
        if (ok) {
          state.selectedDay = targetDate;
          state.viewDate = startOfMonth(fromISO(targetDate));
          state.calendarView = 'day';
          renderAfterLessonChange();
          showToast(`Lezione fissata ${offsetDays === 0 ? 'oggi' : 'domani'} alle ${preferredTime}.`, 'ok');
          return;
        }
      }
      state.selectedDay = targetDate;
      state.viewDate = startOfMonth(fromISO(targetDate));
      renderDayModal(targetDate);
      openModal('dayModalBackdrop');
    }


    function getSuggestedReschedules(lesson) {
      const client = getClient(lesson.clientId);
      if (!client) return [];
      const times = [...new Set([lesson.time, client.fixedTime, ...getUsualTimes(client.id), ...getDefaultTimes()].filter(Boolean))].slice(0, 6);
      const weekdays = getUsualWeekdays(client.id);
      const targetWeekdays = weekdays.length ? weekdays.slice(0, 3) : [normalizeWeekday(fromISO(lesson.date).getDay())];
      const suggestions = [];
      const seen = new Set();
      for (let offset = 1; offset <= 35 && suggestions.length < 8; offset++) {
        const date = addDays(fromISO(lesson.date), offset);
        if (!targetWeekdays.includes(normalizeWeekday(date.getDay()))) continue;
        for (const time of times) {
          const iso = toISO(date);
          const key = `${iso}_${time}`;
          if (seen.has(key)) continue;
          if (state.lessons.some(item => item.clientId === client.id && item.date === iso && item.time === time && item.status !== 'cancelled')) continue;
          if (hasTimeConflict({ date: iso, time, duration: lesson.duration })) continue;
          seen.add(key);
          suggestions.push({ date: iso, time });
          if (suggestions.length >= 8) break;
        }
      }
      return suggestions;
    }

    let activeModalTrigger = null;
    function getFocusableElements(root) {
      return [...root.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')].filter(item => !item.disabled && item.offsetParent !== null);
    }
    function trapModalFocus(event) {
      const open = document.querySelector('.modal-backdrop.open .modal');
      if (!open || event.key !== 'Tab') return;
      const focusable = getFocusableElements(open);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    let bodyScrollLockDepth = 0;
    let bodyScrollLockY = 0;

    function lockBodyScroll() {
      bodyScrollLockDepth += 1;
      if (bodyScrollLockDepth > 1) return;
      bodyScrollLockY = window.scrollY || window.pageYOffset || 0;
      document.documentElement.classList.add('modal-scroll-lock');
      document.body.classList.add('modal-scroll-lock');
      document.body.style.top = `-${bodyScrollLockY}px`;
    }

    function unlockBodyScroll(force = false) {
      if (force) {
        bodyScrollLockDepth = 0;
      } else if (bodyScrollLockDepth > 0) {
        bodyScrollLockDepth -= 1;
      }
      if (bodyScrollLockDepth > 0) return;
      const restoreY = Math.abs(parseInt(document.body.style.top || '0', 10)) || bodyScrollLockY || 0;
      document.documentElement.classList.remove('modal-scroll-lock');
      document.body.classList.remove('modal-scroll-lock');
      document.body.style.top = '';
      window.scrollTo(0, restoreY);
      bodyScrollLockY = 0;
    }

    /* ── Haptic feedback leggero (Android) ─────────────────────── */
    function haptic(ms = 8) {
      try { if (navigator.vibrate) navigator.vibrate(ms); } catch(e) {}
    }

    /* ── Dynamic theme-color per status bar iOS ─────────────────── */
    const _themeColorMeta = document.querySelector('meta[name="theme-color"]');
    function setThemeColor(color) {
      if (_themeColorMeta) _themeColorMeta.setAttribute('content', color);
    }

    function openModal(id, trigger = document.activeElement) {
      if (id === 'operazioniModalBackdrop') renderOperazioniModal();
      if (id === 'atRiskModalBackdrop') renderAtRiskModal();
      if (id === 'completamentoModalBackdrop') renderCompletamentoModal();
      const backdrop = document.getElementById(id);
      if (!backdrop) return;
      activeModalTrigger = trigger instanceof HTMLElement ? trigger : activeModalTrigger;
      backdrop.classList.add('open');
      lockBodyScroll();
      /* Theme color contestuale per tipo di modal */
      const dangerModals = ['confirmModalBackdrop'];
      const isDanger = dangerModals.includes(id) ||
        backdrop.querySelector('.btn-danger') !== null;
      setThemeColor(isDanger ? '#1a0505' : '#0b0b0b');
      haptic(6);
      const modal = backdrop.querySelector('.modal');
      if (modal) {
        if (!modal.hasAttribute('tabindex')) modal.setAttribute('tabindex', '-1');
        const target = getFocusableElements(modal)[0] || modal;
        requestAnimationFrame(() => target.focus());
        /* Swipe-to-close on mobile */
        attachSwipeClose(modal, () => closeModal(backdrop.id));
      }
    }
    function closeModal(id) {
      const backdrop = document.getElementById(id);
      if (!backdrop) return;
      backdrop.classList.remove('open');
      unlockBodyScroll();
      if (!document.querySelector('.modal-backdrop.open')) {
        setThemeColor('#141414');
      }
      if (!document.querySelector('.modal-backdrop.open') && activeModalTrigger && document.body.contains(activeModalTrigger)) {
        activeModalTrigger.focus();
      }
    }

    /* ── Swipe-to-close for bottom sheet modals ─────────────── */
    function attachSwipeClose(el, onClose) {
      if (el._swipeAttached) return;
      el._swipeAttached = true;

      const interactiveSelector = 'input, textarea, select, button, [contenteditable="true"]';
      let startY = 0;
      let currentY = 0;
      let dragging = false;
      let canStartDrag = false;

      function findScrollableAncestor(node) {
        let current = node;
        while (current && current !== el) {
          if (current instanceof HTMLElement) {
            const style = window.getComputedStyle(current);
            const canScroll = /(auto|scroll|overlay)/.test(style.overflowY || '');
            if (canScroll && current.scrollHeight > current.clientHeight + 2) return current;
          }
          current = current.parentElement;
        }
        return null;
      }

      function startedFromTopZone(target, touchY) {
        if (!(target instanceof HTMLElement)) return false;
        if (target.closest(interactiveSelector)) return false;
        const scrollable = findScrollableAncestor(target);
        if (scrollable && scrollable.scrollTop > 0) return false;
        const modalTop = el.getBoundingClientRect().top;
        return (touchY - modalTop) <= 88;
      }

      el.addEventListener('touchstart', e => {
        if (window.innerWidth > 580) return;
        startY = e.touches[0].clientY;
        currentY = startY;
        canStartDrag = startedFromTopZone(e.target, startY);
        dragging = false;
        if (!canStartDrag) return;
        el.style.transition = 'none';
      }, { passive: true });

      el.addEventListener('touchmove', e => {
        if (!canStartDrag) return;
        currentY = e.touches[0].clientY;
        const dy = Math.max(0, currentY - startY);
        if (dy < 8 && !dragging) return;
        dragging = true;
        el.style.transform = `translateY(${dy}px)`;
      }, { passive: true });

      function resetSwipeState() {
        dragging = false;
        canStartDrag = false;
        el.style.transition = '';
      }

      el.addEventListener('touchend', () => {
        if (!canStartDrag) return;
        const dy = currentY - startY;
        resetSwipeState();
        if (dy > 90) {
          el.style.transform = 'translateY(100%)';
          setTimeout(() => { el.style.transform = ''; onClose(); }, 220);
        } else {
          el.style.transform = '';
        }
      });

      el.addEventListener('touchcancel', () => {
        if (!canStartDrag && !dragging) return;
        resetSwipeState();
        el.style.transform = '';
      });
      el.addEventListener('touchmove', e => {
        if (!window.innerWidth || window.innerWidth > 580) return;
        const target = e.target;
        const isScrollableArea = target instanceof HTMLElement && !!target.closest('.modal, .confirm-modal, .fsc-modal, .mp-modal');
        if (!isScrollableArea) e.preventDefault();
      }, { passive: false });
    }

    /* ── Custom confirm dialog (replaces window.confirm) ─────── */
    function showConfirm(title, message, onConfirm, confirmLabel = 'Elimina') {
      const backdrop = document.getElementById('confirmModalBackdrop');
      const titleEl  = document.getElementById('confirmModalTitle');
      const msgEl    = document.getElementById('confirmModalMsg');
      const okBtn    = document.getElementById('confirmModalOk');
      const cancelBtn = document.getElementById('confirmModalCancel');
      if (!backdrop) { if (onConfirm) onConfirm(); return; }
      titleEl.textContent   = title;
      msgEl.textContent     = message;
      okBtn.textContent     = confirmLabel;
      backdrop.classList.add('open');
      lockBodyScroll();
      /* remove old listeners */
      const newOk = okBtn.cloneNode(true);
      const newCancel = cancelBtn.cloneNode(true);
      okBtn.replaceWith(newOk);
      cancelBtn.replaceWith(newCancel);
      function close() {
        backdrop.classList.remove('open');
        unlockBodyScroll();
      }
      newOk.addEventListener('click', () => { close(); if (onConfirm) onConfirm(); });
      newCancel.addEventListener('click', close);
      backdrop.addEventListener('click', e => { if (e.target === backdrop) close(); }, { once: true });
      requestAnimationFrame(() => newOk.focus());
    }

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        const confirmOpen = document.getElementById('confirmModalBackdrop')?.classList.contains('open');
        if (confirmOpen) { document.getElementById('confirmModalBackdrop').classList.remove('open'); unlockBodyScroll(); return; }
        const fscOpen = document.getElementById('fscBackdrop')?.classList.contains('open');
        if (fscOpen) { document.getElementById('fscBackdrop').classList.remove('open'); unlockBodyScroll(); return; }
        const mpOpen = document.getElementById('mpBackdrop')?.classList.contains('open');
        if (mpOpen) { document.getElementById('mpBackdrop').classList.remove('open'); unlockBodyScroll(); return; }
        const openBackdrop = document.querySelector('.modal-backdrop.open');
        if (openBackdrop) closeModal(openBackdrop.id);
      }
      trapModalFocus(event);
    });

    /* Safety valve: se nessun modal è aperto ma lo scroll è ancora bloccato, sblocca.
       Cattura i casi in cui un modal viene chiuso senza passare per closeModal. */
    document.addEventListener('click', () => {
      const anyOpen = document.querySelector(
        '.modal-backdrop.open, .confirm-modal-backdrop.open, .fsc-backdrop.open, .mp-backdrop.open'
      );
      if (!anyOpen && bodyScrollLockDepth > 0) {
        unlockBodyScroll(true);
      }
    }, { capture: true, passive: true });

    function buildPackageSummary(pkg, priceOverride = null) {
      if (!pkg) return '<div class="muted">Nessun pacchetto</div>';
      const total = Number(priceOverride != null ? priceOverride : (pkg.totalPrice || 0));
      const unit = Number(pkg.lessonsTotal || 0) > 0 ? total / Number(pkg.lessonsTotal || 0) : 0;
      return `
        <strong>${escapeHtml(pkg.name)}</strong>
        <div class="pill-row" style="margin-top:10px;">
          <span class="tag">${pkg.lessonsTotal} lezioni</span>
          <span class="tag">${pkg.weeks} settimane</span>
          <span class="tag">${pkg.perWeek} / settimana</span>
          <span class="tag">${pkg.duration} min</span>
          <span class="tag">${formatCurrency(total)}</span>
          <span class="tag">${formatCurrency(unit)}/lez</span>
        </div>
      `;
    }

    function renderPackageOptions(select, selectedId) {
      select.innerHTML = state.packages.map(pkg => `<option value="${pkg.id}" ${pkg.id === selectedId ? 'selected' : ''}>${escapeHtml(pkg.name)}</option>`).join('');
      if (!select.value && state.packages[0]) select.value = state.packages[0].id;
    }

    function getSelectedClientWeekdays() {
      return sortWeekdays([...el.clientWeekdayPicker.querySelectorAll('[data-weekday].active')].map(button => Number(button.getAttribute('data-weekday'))));
    }

    function renderVariableScheduleGrid(selected = []) {
      if (!el.clientVariableScheduleGrid) return;
      const lookup = new Map((selected || []).map(item => [Number(item.weekday), item.time || '']));
      el.clientVariableScheduleGrid.innerHTML = [1,2,3,4,5,6,7].map(day => `
        <label class="summary-row" style="gap:10px;align-items:center;">
          <span style="display:flex;align-items:center;gap:8px;">
            <input type="checkbox" data-variable-weekday="${day}" ${lookup.has(day) ? 'checked' : ''} />
            <span>${weekdayLabel(day)}</span>
          </span>
          <input type="time" data-variable-time="${day}" value="${escapeHtml(lookup.get(day) || '')}" style="max-width:150px;" />
        </label>
      `).join('');
      el.clientVariableScheduleGrid.querySelectorAll('input').forEach(input => input.addEventListener('input', renderFixedSchedulePreview));
      el.clientVariableScheduleGrid.querySelectorAll('input[type="checkbox"]').forEach(input => input.addEventListener('change', renderFixedSchedulePreview));
    }

    function getVariableScheduleSelections() {
      if (!el.clientVariableScheduleGrid) return [];
      return [1,2,3,4,5,6,7].map(day => {
        const checked = el.clientVariableScheduleGrid.querySelector(`[data-variable-weekday="${day}"]`)?.checked;
        const time = el.clientVariableScheduleGrid.querySelector(`[data-variable-time="${day}"]`)?.value || '';
        return checked && time ? { weekday: day, time } : null;
      }).filter(Boolean).sort((a,b)=>a.weekday-b.weekday);
    }

    function updateInstallmentsUI() {
      const isFreeSession = el.clientServiceType?.value === 'free_session';
      const isInstallments = el.clientPaymentMode?.value === 'installments';
      if (el.clientInstallmentsRow) el.clientInstallmentsRow.hidden = isFreeSession || !isInstallments;
      if (!isInstallments) {
        if (el.clientInstallmentsTotal) el.clientInstallmentsTotal.value = '2';
        if (el.clientInstallmentsPaid) el.clientInstallmentsPaid.value = el.clientPaymentStatus?.value === 'paid' ? '1' : '0';
      } else {
        // Modalità rate: aggiorna il select paymentStatus in base alle rate inserite
        const total = Math.min(3, Math.max(2, Number(el.clientInstallmentsTotal?.value || 2)));
        const paid  = Math.max(0, Math.min(total, Number(el.clientInstallmentsPaid?.value || 0)));
        const derived = paid >= total ? 'paid' : paid > 0 ? 'partial' : 'unpaid';
        if (el.clientPaymentStatus) el.clientPaymentStatus.value = derived;
      }
    }

    function updateFixedScheduleUI() {
      const mode = document.querySelector('input[name="scheduleMode"]:checked')?.value || 'same';
      const serviceType = el.clientServiceType?.value || 'personal';
      let pkg = getPackage(el.clientPackage.value);
      if (serviceType === 'free_session') pkg = ensureSpecialPackage('free_session');
      const requiredDays = Math.max(1, Number(pkg?.perWeek || 1));
      const selectedDays = getSelectedClientWeekdays();
      const variableSelections = getVariableScheduleSelections();
      el.fixedScheduleBlock.hidden = false;
      if (el.variableScheduleBlock) el.variableScheduleBlock.style.display = mode !== 'different' ? 'none' : 'grid';
      const sameFields = document.getElementById('sameScheduleFields');
      if (sameFields) sameFields.hidden = mode !== 'same';
      if (mode !== 'same') {
        const selectedText = variableSelections.length ? variableSelections.map(item => `${weekdayLabel(item.weekday)} ${item.time}`).join(', ') : 'nessuno';
        if (el.fixedScheduleHint) el.fixedScheduleHint.textContent = `Seleziona ${requiredDays} giorni con orari diversi. Giorni scelti: ${selectedText}.`;
        renderFixedSchedulePreview();
        return;
      }
      const dayWord = requiredDays === 1 ? 'giorno' : 'giorni';
      const selectedText = selectedDays.length ? selectedDays.map(weekdayLabel).join(', ') : 'nessuno';
      if (el.fixedScheduleHint) el.fixedScheduleHint.textContent = `Seleziona ${requiredDays} ${dayWord} e un'ora fissa. Al salvataggio creo tutte le lezioni del pacchetto. Giorni scelti: ${selectedText}.`;
    }

    function renderClientWeekdayPicker(selectedDays = [], requiredDays = null) {
      const days = sortWeekdays(selectedDays);
      el.clientWeekdayPicker.innerHTML = [1,2,3,4,5,6,7].map(day => `
        <button type="button" class="weekday-chip ${days.includes(day) ? 'active' : ''}" data-weekday="${day}">${weekdayLabel(day)}</button>
      `).join('');
      el.clientWeekdayPicker.querySelectorAll('[data-weekday]').forEach(button => {
        button.addEventListener('click', () => {
          const day = Number(button.getAttribute('data-weekday'));
          let picked = getSelectedClientWeekdays();
          if (picked.includes(day)) {
            picked = picked.filter(item => item !== day);
          } else {
            picked.push(day);
          }
          picked = sortWeekdays(picked);
          if (requiredDays && picked.length > requiredDays) {
            picked = picked.slice(picked.length - requiredDays);
          }
          renderClientWeekdayPicker(picked, requiredDays);
          updateFixedScheduleUI();
        });
      });
      updateFixedScheduleUI();
      renderFixedSchedulePreview();
    }

    function createRecurringLessonsForClient({ client, plan, pkg, startDate, weekdays, time, timesByWeekday = null, firstLessonType = null, standardLessonType = null }) {
      const selectedDays = sortWeekdays(weekdays);
      if (!client || !plan || !pkg || !startDate || (!time && !timesByWeekday) || !selectedDays.length) return 0;
      const total = Number(pkg.lessonsTotal || 0);
      if (!total) return 0;
      const cursor = fromISO(startDate);
      cursor.setHours(0, 0, 0, 0);
      const createdLessons = [];
      let attempts = 0;
      while (createdLessons.length < total && attempts < 730) {
        const iso = toISO(cursor);
        const weekday = normalizeWeekday(cursor.getDay());
        if (selectedDays.includes(weekday)) {
          const slotTime = (timesByWeekday && timesByWeekday[weekday]) || time;
          if (!slotTime) { cursor.setDate(cursor.getDate() + 1); attempts += 1; continue; }
          if (!state.lessons.some(item => item.clientId === client.id && item.date === iso && item.time === slotTime && item.status !== 'cancelled')
            && !hasTimeConflict({ date: iso, time: slotTime, duration: pkg.duration })
            && canUsePlanSlot(plan.id)) {
            const lessonType = createdLessons.length === 0 && firstLessonType ? firstLessonType : (standardLessonType || lessonTypeForNewLesson(client));
            const lesson = {
              id: uid('lesson'),
              clientId: client.id,
              planId: plan.id,
              date: iso,
              time: slotTime,
              duration: Number(pkg.duration || 60),
              lessonType,
              status: 'scheduled',
              note: '',
              linkedTo: null,
              googleEventId: '',
              createdAt: new Date().toISOString()
            };
            state.lessons.push(lesson);
            createdLessons.push(lesson.id);
          }
        }
        cursor.setDate(cursor.getDate() + 1);
        attempts += 1;
      }
      if (createdLessons.length) {
        saveState();
        renderAll();
        createdLessons.forEach(id => requestGoogleLessonSync('upsert', id, { allowCreateWithoutEventId: true }));
      }
      return createdLessons.length;
    }

    function getManagedClientsForMonth(monthDate = startOfMonth(new Date())) {
      const unique = new Map();

      /* 1. Clienti che hanno lezioni SVOLTE o PROGRAMMATE nel mese
            → escludi lezioni free_session pure (tipo servizio free_session)
            → includi pack99 (è personal con una free iniziale) */
      state.lessons
        .filter(lesson => {
          if (lesson.status === 'cancelled') return false;
          if (!sameMonth(fromISO(lesson.date), monthDate)) return false;
          /* Escludi lezioni di tipo free_session puro */
          const lType = lesson.lessonType || lesson.type || '';
          if (lType === 'free_session') return false;
          return true;
        })
        .forEach(lesson => {
          const client = getClient(lesson.clientId);
          if (!client) return;
          /* Escludi clienti il cui servizio principale è free_session (non hanno ancora acquistato) */
          if (getClientServiceType(client) === 'free_session') return;
          unique.set(client.id, client);
        });

      /* 2. Clienti che hanno acquistato un pacchetto (piano creato) nel mese
            → includi anche pack99
            → escludi free_session puri */
      state.plans
        .filter(plan => sameMonth(new Date(plan.createdAt || plan.startDate || new Date()), monthDate))
        .forEach(plan => {
          const client = getClient(plan.clientId);
          if (!client) return;
          if (getClientServiceType(client) === 'free_session') return;
          const pkg = getPackage(plan.packageId);
          /* Escludi pacchetti che sono solo FREE SESSION */
          if (pkg && pkg.name.toUpperCase() === 'FREE SESSION') return;
          unique.set(client.id, client);
        });

      return [...unique.values()].sort((a, b) => {
        const left  = `${String(a.lastName  || '').trim()} ${String(a.firstName || '').trim()}`.trim().toUpperCase();
        const right = `${String(b.lastName  || '').trim()} ${String(b.firstName || '').trim()}`.trim().toUpperCase();
        return left.localeCompare(right, 'it');
      });
    }

async function exportManagedXlsx() {
      /* Apri il month picker con default = mese corrente (oggi) */
      openMonthPicker(new Date(), async (monthDate) => {
        try {
          showToast('Preparazione Excel…');
          await ensureExcelJS();
          if (!window.ExcelJS) { showToast('Modulo Excel non disponibile.', 'error'); return; }

          const clients  = getManagedClientsForMonth(monthDate);
          const meseIT   = MONTHS_IT[monthDate.getMonth()]; /* es. "Aprile" */
          const mmyyyy   = `${String(monthDate.getMonth()+1).padStart(2,'0')}-${monthDate.getFullYear()}`;
          const fileName = `Elenco Gestiti PT ${mmyyyy}.xlsx`;

          const workbook = new window.ExcelJS.Workbook();
          const binary   = Uint8Array.from(atob(GESTITI_TEMPLATE_BASE64), c => c.charCodeAt(0));
          await workbook.xlsx.load(binary.buffer);
          const sheet    = workbook.getWorksheet('Gestiti') || workbook.worksheets[0];

          /* ── Stili ── */
          const whiteFill = { type:'pattern', pattern:'solid', fgColor:{argb:'FFFFFFFF'}, bgColor:{argb:'FFFFFFFF'} };
          const blackFill = { type:'pattern', pattern:'solid', fgColor:{argb:'FF000000'}, bgColor:{argb:'FF000000'} };
          const border    = { left:{style:'thin',color:{argb:'FF000000'}}, right:{style:'thin',color:{argb:'FF000000'}}, top:{style:'thin',color:{argb:'FF000000'}}, bottom:{style:'thin',color:{argb:'FF000000'}} };

          function applyCell(addr, { fill=whiteFill, font={}, alignment={}, value }={}) {
            const cell = sheet.getCell(addr);
            if (typeof value !== 'undefined') cell.value = value;
            cell.fill   = cloneJson(fill);
            cell.border = cloneJson(border);
            cell.font   = { name: font.name||cell.font?.name||'Calibri', size: font.size||cell.font?.size||11, bold: typeof font.bold==='boolean'?font.bold:!!cell.font?.bold, italic: typeof font.italic==='boolean'?font.italic:!!cell.font?.italic, color: font.color||{argb:'FF000000'} };
            cell.alignment = { vertical:'middle', horizontal: alignment.horizontal||cell.alignment?.horizontal||'left', wrapText: typeof alignment.wrapText==='boolean'?alignment.wrapText:!!cell.alignment?.wrapText };
            return cell;
          }

          /* ── B1: nome mese in italiano (testo, non data) ── */
          applyCell('B1', {
            fill: blackFill,
            font: { name:'Calibri', size:14, bold:true, color:{argb:'FFFFFFFF'} },
            alignment: { horizontal:'center' },
            value: meseIT /* stringa italiana, es. "Aprile" */
          });

          /* ── B2: pulisci ── */
          applyCell('B2', {
            fill: whiteFill,
            font: { name:'Calibri', size:11, bold:true, italic:true, color:{argb:'FF000000'} },
            alignment: { horizontal:'center' }
          });

          /* ── Pulisci righe precedenti fino a riga sufficiente ── */
          const clearUntil = Math.max(sheet.rowCount || 40, 3 + clients.length + 4);
          for (let row = 3; row <= clearUntil; row++) {
            applyCell(`B${row}`, {
              fill: whiteFill,
              font: { name:'Helvetica', size:11, bold:false, italic:false, color:{argb:'FF000000'} },
              alignment: { horizontal:'left' },
              value: ''
            });
          }

          /* ── D1 header ── */
          applyCell('D1', { fill:blackFill, font:{name:'Calibri',size:12,bold:true,color:{argb:'FFFFFFFF'}}, alignment:{horizontal:'left'} });
          ['D2','D3','D4','D5','D6'].forEach(a => applyCell(a, { fill:whiteFill, font:{name:'Calibri',size:11,color:{argb:'FF000000'}}, alignment:{horizontal:'left',wrapText:true} }));

          /* ── Nomi clienti da B3 in giù ── */
          clients.forEach((client, i) => {
            const fullName = `${String(client.firstName||'').trim()} ${String(client.lastName||'').trim()}`.replace(/\s+/g,' ').trim().toUpperCase();
            applyCell(`B${3 + i}`, {
              fill: whiteFill,
              font: { name:'Helvetica', size:11, bold:false, italic:false, color:{argb:'FF000000'} },
              alignment: { horizontal:'left' },
              value: fullName
            });
          });

          const buffer = await workbook.xlsx.writeBuffer();
          const blob   = new Blob([buffer], { type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          const url    = URL.createObjectURL(blob);
          const a      = Object.assign(document.createElement('a'), { href:url, download:fileName });
          document.body.appendChild(a); a.click(); a.remove();
          URL.revokeObjectURL(url);
          showToast(`✅ Excel ${meseIT} ${monthDate.getFullYear()} — ${clients.length} gestiti.`, 'ok');
        } catch (err) {
          console.error(err);
          showToast('Excel non generato.', 'error');
        }
      });
    }

function getPaymentStatusLabel(status = 'unpaid') {
  return status === 'paid' ? 'SALDATO' : status === 'partial' ? 'ACCONTO' : 'DA PAGARE';
}

function getPaymentModeLabel(mode = 'single') {
  if (mode === 'included') return 'INCLUSO';
  return mode === 'installments' ? 'RATEIZZATO' : 'UNICA SOLUZIONE';
}

function formatSnapshotDate(value) {
  try {
    return new Date(value).toLocaleDateString('it-IT');
  } catch (error) {
    return '—';
  }
}

function ensureClientHistoryBuckets(client) {
  if (!client) return;
  if (!Array.isArray(client.paymentHistory)) client.paymentHistory = [];
  if (!Array.isArray(client.renewalHistory)) client.renewalHistory = [];
}

function pushClientPaymentSnapshot(client, reason = 'update') {
  if (!client) return;
  ensureClientHistoryBuckets(client);
  const snapshot = {
    id: uid('payhist'),
    createdAt: new Date().toISOString(),
    reason,
    paymentStatus: client.paymentStatus || 'unpaid',
    paymentMode: client.paymentMode || 'single',
    installmentsTotal: Number(client.installmentsTotal || 1),
    installmentsPaid: Number(client.installmentsPaid || 0)
  };
  const last = client.paymentHistory[client.paymentHistory.length - 1];
  if (last && last.paymentStatus === snapshot.paymentStatus && last.paymentMode === snapshot.paymentMode && Number(last.installmentsTotal || 1) === snapshot.installmentsTotal && Number(last.installmentsPaid || 0) === snapshot.installmentsPaid) {
    return;
  }
  client.paymentHistory.push(snapshot);
}

    function renderClientHistory(client) {
      if (!client) return;
      ensureClientHistoryBuckets(client);
      const paymentRows = [...(client.paymentHistory || [])].slice().reverse();
      
      // Protezione contro l'elemento mancante (evita il crash)
      const historyEl = document.getElementById('clientPaymentHistory') || el.clientPaymentHistory;
      if (historyEl) {
        historyEl.innerHTML = paymentRows.length ? paymentRows.map(item => {
          const extra = item.paymentMode === 'installments' ? ` · RATE ${Number(item.installmentsPaid || 0)}/${Number(item.installmentsTotal || 1)}` : '';
          return `<div class="summary-row"><span>${escapeHtml(formatSnapshotDate(item.createdAt))} · ${escapeHtml(getPaymentStatusLabel(item.paymentStatus))} · ${escapeHtml(getPaymentModeLabel(item.paymentMode))}${extra}</span><span class="tag">${escapeHtml(item.reason === 'create' ? 'iniziale' : 'update')}</span></div>`;
        }).join('') : '<div class="muted">Nessun pagamento registrato</div>';
      }

      // Protezione anche per la cronologia dei piani
      const planHistoryEl = document.getElementById('clientPlanHistory') || el.clientPlanHistory;
      if (planHistoryEl) {
        const planRows = state.plans
          .filter(plan => plan.clientId === client.id && plan.saleType === 'renewal')
          .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
          .map(plan => {
            const pkg = getPackage(plan.packageId);
            return {
              date: plan.createdAt || plan.startDate,
              label: `${pkg?.name || 'Pacchetto'} · dal ${formatDateFancy(plan.startDate)}`
            };
          });
        planHistoryEl.innerHTML = planRows.length ? planRows.map(item => `<div class="summary-row"><span>${escapeHtml(formatSnapshotDate(item.date))} · ${escapeHtml(item.label)}</span></div>`).join('') : '<div class="muted">Nessun rinnovo registrato</div>';
      }
    }

function buildAppointmentsText(clientId) {
  const client = getClient(clientId);
  if (!client) return '';
  const today = todayISO();
  const lessons = getLessonsForClient(clientId)
    .filter(item => item.status === 'scheduled' && item.date >= today)
    .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
  if (!lessons.length) return '';
  const lines = lessons.map(lesson => {
    const dateFormatted = fromISO(lesson.date).toLocaleDateString('it-IT', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' });
    return `${dateFormatted} ore ${lesson.time}`;
  });
  return lines.join('\n');
}

function copyAppointmentsToClipboard() {
  const clientId = el.clientId.value;
  const text = buildAppointmentsText(clientId);
  if (!text) {
    showToast('Nessun appuntamento da copiare.');
    return;
  }
  /* Web Share API — apre il foglio nativo iOS (WhatsApp, Mail, AirDrop…) */
  if (navigator.share) {
    navigator.share({ title: 'Appuntamenti DSWORLD', text })
      .then(() => showToast('Appuntamenti condivisi!', 'ok'))
      .catch(err => { if (err.name !== 'AbortError') showToast('Condivisione annullata.'); });
    return;
  }
  /* Fallback clipboard */
  navigator.clipboard.writeText(text).then(() => {
    showToast('Appuntamenti copiati!', 'ok');
  }).catch(() => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.cssText = 'position:fixed;opacity:0;';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
    showToast('Appuntamenti copiati!', 'ok');
  });
}

function applyReportFilter() {
  const filter = state.reportFilter || 'all';
  const toggle = (node, show) => { if (node) node.style.display = show ? '' : 'none'; };
  toggle(el.reportSectionFreeSession, filter === 'all' || filter === 'free_session');
  toggle(el.reportSectionPack99, filter === 'all' || filter === 'pack99');
  toggle(el.reportSectionPersonal, filter === 'all' || filter === 'personal');
  toggle(el.reportSectionOutstanding, filter === 'all' || filter === 'outstanding');
  toggle(el.reportSectionInstallments, filter === 'all' || filter === 'installments');
  if (el.reportFilterBar) {
    el.reportFilterBar.querySelectorAll('[data-report-filter]').forEach(button => {
      const active = button.getAttribute('data-report-filter') === filter;
      button.className = active ? 'btn btn-soft btn-small active' : 'btn btn-ghost btn-small';
    });
  }
}

    function renderClientModal(client = null, trigger = document.activeElement) {
      el.clientModalTitle.textContent = client ? 'Modifica cliente' : 'Nuovo cliente';
      el.clientId.value = client?.id || '';
      const fullName = client ? (getClientFullName(client) !== 'Cliente' ? getClientFullName(client) : (client.name || '')) : '';
      const nameParts = splitFullName(client?.name || fullName);
      el.clientName.value = client?.firstName || nameParts.firstName || '';
      el.clientSurname.value = client?.lastName || nameParts.lastName || '';
      if (el.clientEmail) el.clientEmail.value = client?.email || '';
      if (el.clientSendCalendarInvite) el.clientSendCalendarInvite.value = client?.sendCalendarInvite ? 'yes' : 'no';
      el.clientNotes.value = client?.notes || '';
      el.clientStartDate.value = client ? (getActivePlan(client.id)?.startDate || todayISO()) : todayISO();
      const activePlan = client ? getActivePlan(client.id) : null;
      renderPackageOptions(el.clientPackage, activePlan?.packageId || state.packages[0]?.id || '');
      el.clientCheckMode.value = normalizeCheckMode(activePlan?.checkMode);
      el.clientServiceType.value = client?.serviceType || 'personal';
      el.clientFreeSessionDone.value = client?.freeSessionDone ? 'yes' : 'no';
      el.clientPackagePurchased.value = client?.packagePurchased ? 'yes' : 'no';
      el.clientConversionStatus.value = client?.conversionStatus || 'path_started';
      el.clientPaymentStatus.value = client?.paymentStatus || 'unpaid';
      el.clientPaymentMode.value = client?.paymentMode || 'single';
      el.clientInstallmentsTotal.value = String(client?.installmentsTotal || 2);
      el.clientInstallmentsPaid.value = String(client?.installmentsPaid || 0);
      const mode = client?.scheduleMode || 'same';
      document.querySelectorAll('input[name="scheduleMode"]').forEach(input => input.checked = input.value === mode);
      const serviceType = el.clientServiceType?.value || 'personal';
      let pkg = getPackage(el.clientPackage.value);
      if (serviceType === 'free_session') pkg = ensureSpecialPackage('free_session');
      const defaultDay = normalizeWeekday(fromISO(el.clientStartDate.value || todayISO()).getDay());
      el.clientFixedTime.value = client?.fixedTime || '';
      renderClientWeekdayPicker(client?.fixedDays?.length ? client.fixedDays : [defaultDay], Math.max(1, Number(pkg?.perWeek || 1)));
      renderVariableScheduleGrid(client?.variableSchedule || []);
      const selectedPkg = getPackage(el.clientPackage.value);
      if (el.clientPackagePrice) el.clientPackagePrice.value = Number(client?.packagePrice || selectedPkg?.totalPrice || 0);
      el.packagePreview.innerHTML = buildPackageSummary(selectedPkg, Number(el.clientPackagePrice?.value || selectedPkg?.totalPrice || 0));
      updateClientServiceUi();
      updateInstallmentsUI();
      updateFixedScheduleUI();
      renderClientHistory(client);
      el.deleteClientBtn.style.display = client ? 'inline-flex' : 'none';
      openModal('clientModalBackdrop', trigger);
    }

    function renderPackages() {
      if (!state.packages.length) {
        el.packageList.innerHTML = '<div class="empty">Nessun pacchetto</div>';
        return;
      }
      el.packageList.innerHTML = state.packages.map(pkg => `
        <button class="package-card ${pkg.id === state.selectedPackageId ? 'active' : ''}" data-package-id="${pkg.id}" style="text-align:left;cursor:pointer;">
          <strong>${escapeHtml(pkg.name)}</strong>
          <div class="pill-row" style="margin-top:10px;">
            <span class="tag">${pkg.lessonsTotal} lez</span>
            <span class="tag">${pkg.weeks} sett</span>
            <span class="tag">${pkg.perWeek}/sett</span>
            <span class="tag">${pkg.duration} min</span>
            <span class="tag">${formatCurrency(pkg.totalPrice || 0)}</span>
          </div>
        </button>
      `).join('');
      el.packageList.querySelectorAll('[data-package-id]').forEach(button => {
        button.addEventListener('click', () => {
          const pkg = getPackage(button.getAttribute('data-package-id'));
          if (!pkg) return;
          state.selectedPackageId = pkg.id;
          el.packageId.value = pkg.id;
          el.packageName.value = pkg.name;
          el.packageLessons.value = pkg.lessonsTotal;
          el.packageWeeks.value = pkg.weeks;
          el.packagePerWeek.value = pkg.perWeek;
          el.packageDuration.value = pkg.duration;
          el.packagePrice.value = Number(pkg.totalPrice || 0);
          renderPackages();
        });
      });
    }

    function renderHero() {
      const snapshot = getMonthSnapshot(state.viewDate);
      const alerts = getAlerts();
      const urgentAlerts = alerts.filter(item => item.type === 'renewal' || item.type === 'payment').length;
      const completionRate = snapshot.done + snapshot.cancelled ? Math.round((snapshot.done / (snapshot.done + snapshot.cancelled)) * 100) : 0;
      const todayLessons = getLessonsByDate(todayISO()).filter(item => item.status !== 'cancelled').length;
      // Fix 4: atRisk solo mese corrente con piano iniziato
      const viewMonth = state.viewDate;
      const atRisk = state.clients.filter(c => {
        if (!isManagedClient(c)) return false;
        if ((c.paymentStatus || 'unpaid') === 'paid') return false;
        const plan = getActivePlan(c.id);
        if (!plan || (plan.startDate && plan.startDate > todayISO())) return false;
        const hasLessonsMonth = state.lessons.some(l =>
          l.clientId === c.id && l.status !== 'cancelled' && sameMonth(fromISO(l.date), viewMonth));
        const planStart = fromISO(plan.startDate || todayISO());
        return hasLessonsMonth || sameMonth(planStart, viewMonth) || planStart <= new Date();
      }).length;
      const previous = getMonthSnapshot(addMonths(state.viewDate, -1));

      /* Revenue trend */
      const revDelta = snapshot.revenue - (previous.revenue || 0);
      const revTrend = revDelta === 0 ? 'flat' : revDelta > 0 ? 'up' : 'down';
      const revTrendLabel = revDelta === 0 ? '≈ invariato' : `${revDelta > 0 ? '+' : ''}${formatCurrency(revDelta)} vs mese prec.`;
      const revTrendIcon = revTrend === 'up' ? '↑' : revTrend === 'down' ? '↓' : '→';

      const upcomingHeroLesson = state.lessons
        .filter(item => item.status === 'scheduled' && `${item.date}T${item.time}` >= `${todayISO()}T00:00`)
        .sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`))[0] || null;

      const prossimaVal = upcomingHeroLesson ? getClientFullName(getClient(upcomingHeroLesson.clientId)) : 'Agenda libera';
      const prossimaSub = upcomingHeroLesson ? `${formatDateFancy(upcomingHeroLesson.date)} · ${upcomingHeroLesson.time}` : 'Nessuna sessione imminente';

      // Fix 3: Prossima lezione nella riga heroInsights fianco a Clienti a rischio
      el.heroInsights.innerHTML = [
        { key: 'Incasso mese', value: formatCurrency(snapshot.revenue), sub: `Mese prec. ${formatCurrency(previous.revenue || 0)}`, extra: `<span class="trend ${revTrend}">${revTrendIcon} ${revTrendLabel}</span>`, cls: 'revenue-card' },
        { key: 'Sessioni oggi', value: todayLessons, sub: todayLessons ? 'Operatività in agenda' : 'Giornata libera', cls: '' },
        { key: 'Clienti a rischio', value: atRisk, sub: atRisk ? 'Pagamenti o rinnovi aperti' : 'Nessun rischio critico', cls: `risk-card${atRisk ? ' has-risk' : ''} stat-box-clickable`, action: 'at-risk' },
        { key: 'Prossima lezione', value: prossimaVal, sub: prossimaSub, cls: upcomingHeroLesson ? 'stat-box-clickable' : '', action: upcomingHeroLesson ? 'prossima' : null, lessonDate: upcomingHeroLesson?.date || '' }
      ].map(item => `
        <div class="hero-insight${item.cls ? ' ' + item.cls : ''}"${item.action ? ` data-hero-action="${item.action}"${item.lessonDate ? ` data-lesson-date="${item.lessonDate}"` : ''} role="button" tabindex="0"` : ''}>
          <div class="k">${item.key}</div>
          <div class="v">${item.value}</div>
          <div class="s">${item.sub}</div>
          ${item.extra || ''}
        </div>
      `).join('');

      // Fix 2: Completamento NON cliccabile — heroStats 3 voci
      el.heroStats.innerHTML = [
        { label: 'Base clienti', value: getManagedClients().length, sub: `${snapshot.newClients} nuovi nel mese` },
        { label: 'Completamento', value: `${completionRate}%`, sub: `${snapshot.done} svolte • ${snapshot.cancelled} annullate` },
        { label: 'Operazioni', value: alerts.length, sub: urgentAlerts ? `${urgentAlerts} urgenti` : 'Nessun avviso urgente', action: 'operazioni' }
      ].map(item => `
        <div class="stat-box${item.action ? ' stat-box-clickable' : ''}" ${item.action ? `data-hero-action="${item.action}" role="button" tabindex="0"` : ''}>
          <div class="label">${item.label}</div>
          <div class="value">${item.value}</div>
          <div class="sub">${item.sub}</div>
        </div>
      `).join('');
    }


    /* ── Pianifica lezioni rimanenti ────────────────────────── */
    function openPianificaModal() {
      const client = getClient(state.selectedClientId);
      const plan = client ? getActivePlan(client.id) : null;
      if (!client || !plan) { showToast('Seleziona un cliente con piano attivo.', 'warn'); return; }
      const pkg = getPackage(plan.packageId);
      const stats = planStats(plan);
      if (!stats.remaining) { showToast('Nessuna lezione da pianificare.', 'warn'); return; }

      /* Pre-compila: giorni da fixedDays → storia lezioni → default lunedì */
      const suggestedDays = client.fixedDays?.length
        ? client.fixedDays
        : getUsualWeekdays(client.id).slice(0, Math.max(1, Number(pkg?.perWeek || 1)));
      const suggestedTime = client.fixedTime || getPreferredTime(client.id) || '09:00';

      /* Data inizio: giorno dopo l'ultima lezione futura, o domani */
      const lastFuture = getLessonsForClient(client.id)
        .filter(l => l.status !== 'cancelled' && l.date >= todayISO())
        .sort((a, b) => b.date.localeCompare(a.date))[0];
      const defaultStart = lastFuture
        ? toISO(addDays(fromISO(lastFuture.date), 1))
        : toISO(addDays(new Date(), 1));

      document.getElementById('pianificaTitle').textContent = 'Pianifica rimanenti';
      document.getElementById('pianificaSub').textContent = `${getClientFullName(client)} · ${stats.remaining} lezioni da pianificare`;

      /* Stato locale del form */
      let selDays = [...suggestedDays];
      let selTime = suggestedTime;
      let selStart = defaultStart;
      let saveAsFixed = !!(client.fixedDays?.length);

      const DAYS = [
        { n: 1, label: 'Lun' }, { n: 2, label: 'Mar' }, { n: 3, label: 'Mer' },
        { n: 4, label: 'Gio' }, { n: 5, label: 'Ven' }, { n: 6, label: 'Sab' }, { n: 7, label: 'Dom' }
      ];

      function previewDates() {
        if (!selDays.length || !selTime || !selStart) return [];
        const sorted = sortWeekdays(selDays);
        const cursor = fromISO(selStart);
        cursor.setHours(0,0,0,0);
        const results = [];
        let attempts = 0;
        while (results.length < stats.remaining && attempts < 730) {
          const iso = toISO(cursor);
          const wd = normalizeWeekday(cursor.getDay());
          if (sorted.includes(wd) && !hasTimeConflict({ date: iso, time: selTime, duration: pkg?.duration || 60 })) {
            results.push(iso);
          }
          cursor.setDate(cursor.getDate() + 1);
          attempts++;
        }
        return results;
      }

      function renderForm() {
        const preview = previewDates();
        const canConfirm = selDays.length > 0 && selTime && selStart && preview.length > 0;
        document.getElementById('pianificaContent').innerHTML = `
          <!-- Giorni -->
          <div>
            <div class="small muted" style="margin-bottom:8px;">Giorni della settimana</div>
            <div style="display:flex;gap:6px;flex-wrap:wrap;">
              ${DAYS.map(d => `
                <button type="button" class="weekday-chip${selDays.includes(d.n) ? ' active' : ''}"
                  data-pday="${d.n}" style="min-width:44px;min-height:40px;padding:6px 10px;font-size:0.82rem;
                  border-radius:10px;border:1px solid ${selDays.includes(d.n) ? 'var(--accent)' : 'rgba(255,255,255,0.12)'};
                  background:${selDays.includes(d.n) ? 'rgba(229,9,20,0.15)' : 'rgba(255,255,255,0.04)'};
                  color:${selDays.includes(d.n) ? 'var(--accent)' : 'var(--muted)'};font-weight:${selDays.includes(d.n) ? '700' : '500'};">
                  ${d.label}
                </button>`).join('')}
            </div>
          </div>
          <!-- Orario e data inizio -->
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
            <label style="display:grid;gap:5px;">
              <span class="small muted">Orario</span>
              <input type="time" id="pianificaTime" value="${selTime}"
                style="height:44px;border-radius:12px;padding:0 12px;background:rgba(255,255,255,0.06);
                border:1px solid rgba(255,255,255,0.12);color:var(--text);font-size:0.95rem;" />
            </label>
            <label style="display:grid;gap:5px;">
              <span class="small muted">Prima data</span>
              <input type="date" id="pianificaStart" value="${selStart}"
                style="height:44px;border-radius:12px;padding:0 12px;background:rgba(255,255,255,0.06);
                border:1px solid rgba(255,255,255,0.12);color:var(--text);font-size:0.9rem;" />
            </label>
          </div>
          <!-- Preview -->
          <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:14px;display:grid;gap:8px;">
            ${preview.length ? `
              <div style="display:flex;align-items:center;justify-content:space-between;">
                <span class="small muted">Prima lezione</span>
                <span style="font-size:0.88rem;font-weight:600;">${formatDateFancy(preview[0])}</span>
              </div>
              <div style="display:flex;align-items:center;justify-content:space-between;">
                <span class="small muted">Ultima lezione</span>
                <span style="font-size:0.88rem;font-weight:600;">${formatDateFancy(preview[preview.length - 1])}</span>
              </div>
              <div style="display:flex;align-items:center;justify-content:space-between;padding-top:6px;border-top:1px solid rgba(255,255,255,0.07);">
                <span class="small muted">Lezioni pianificate</span>
                <span style="font-size:1rem;font-weight:800;color:var(--good);">${preview.length} / ${stats.remaining}</span>
              </div>
            ` : `<div class="muted small" style="text-align:center;">Seleziona almeno un giorno e un orario</div>`}
          </div>
          <!-- Salva come fisso -->
          <label style="display:flex;align-items:center;gap:10px;cursor:pointer;padding:10px 12px;
            background:rgba(255,255,255,0.04);border-radius:12px;border:1px solid rgba(255,255,255,0.08);">
            <input type="checkbox" id="pianificaSaveFixed" ${saveAsFixed ? 'checked' : ''}
              style="width:18px;height:18px;accent-color:var(--accent);flex-shrink:0;" />
            <div>
              <div style="font-size:0.88rem;font-weight:600;">Salva come orario fisso</div>
              <div class="small muted">Aggiorna giorni e orario del cliente per le prossime pianificazioni</div>
            </div>
          </label>
          <!-- Azioni -->
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
            <button id="pianificaAnnullaBtn" class="btn btn-ghost btn-small">Annulla</button>
            <button id="pianificaConfirmBtn" class="btn btn-primary btn-small"
              ${!canConfirm ? 'disabled style="opacity:.45;"' : ''}>
              Pianifica ${preview.length > 0 ? preview.length + ' lezioni' : ''}
            </button>
          </div>
        `;

        /* Listeners interni del form */
        document.querySelectorAll('[data-pday]').forEach(btn => {
          btn.addEventListener('click', () => {
            const d = Number(btn.getAttribute('data-pday'));
            selDays = selDays.includes(d) ? selDays.filter(x => x !== d) : [...selDays, d];
            renderForm();
          });
        });
        document.getElementById('pianificaTime').addEventListener('change', e => { selTime = e.target.value; renderForm(); });
        document.getElementById('pianificaStart').addEventListener('change', e => { selStart = e.target.value; renderForm(); });
        document.getElementById('pianificaSaveFixed').addEventListener('change', e => { saveAsFixed = e.target.checked; });
        document.getElementById('pianificaAnnullaBtn')?.addEventListener('click', () => closeModal('pianificaModalBackdrop'));

        document.getElementById('pianificaConfirmBtn')?.addEventListener('click', () => {
          const dates = previewDates();
          saveAsFixed = document.getElementById('pianificaSaveFixed').checked;
          /* Aggiorna orario fisso se richiesto */
          if (saveAsFixed) {
            client.fixedDays = sortWeekdays(selDays);
            client.fixedTime = selTime;
            client.scheduleMode = 'same';
          }
          /* Crea le lezioni */
          const lessonType = lessonTypeForNewLesson(client);
          const created = [];
          dates.forEach(iso => {
            if (hasTimeConflict({ date: iso, time: selTime, duration: pkg?.duration || 60 })) return;
            if (!canUsePlanSlot(plan.id)) return;
            const lesson = {
              id: uid('lesson'),
              clientId: client.id,
              planId: plan.id,
              date: iso,
              time: selTime,
              duration: Number(pkg?.duration || 60),
              lessonType,
              status: 'scheduled',
              note: '',
              linkedTo: null,
              googleEventId: '',
              createdAt: new Date().toISOString()
            };
            state.lessons.push(lesson);
            created.push(lesson);
          });
          if (created.length) {
            saveState(true);
            renderAfterLessonChange();
            created.forEach(l => requestGoogleLessonSync('upsert', l, { allowCreateWithoutEventId: true }));
          }
          closeModal('pianificaModalBackdrop');
          showToast(`${created.length} lezioni pianificate.`, 'ok');
        });
      }

      renderForm();
      openModal('pianificaModalBackdrop');
    }

    /* ── Modal lezioni bonus ────────────────────────────────── */
    function openBonusLessonsModal() {
      const client = getClient(state.selectedClientId);
      const plan = client ? getActivePlan(client.id) : null;
      if (!client || !plan) { showToast('Seleziona un cliente con piano attivo.', 'warn'); return; }
      const pkg = getPackage(plan.packageId);
      const current = Number(plan.bonusLessons || 0);
      let pending = current;

      document.getElementById('bonusLessonsTitle').textContent = 'Lezioni bonus';
      document.getElementById('bonusLessonsSub').textContent = getClientFullName(client);

      function renderBonusContent() {
        const base = Number(pkg?.lessonsTotal || 0);
        const carry = Number(plan.carryOverLessons || 0);
        const newTotal = base + carry + pending;
        document.getElementById('bonusLessonsContent').innerHTML = `
          <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:16px;display:grid;gap:6px;">
            <div style="font-size:0.8rem;color:var(--muted);">Pacchetto base</div>
            <div style="font-size:1.1rem;font-weight:700;">${base}${carry ? ` + ${carry} riportate` : ''} lezioni</div>
          </div>
          <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;">
            <span style="font-size:0.88rem;color:var(--muted);">Lezioni bonus da aggiungere</span>
            <div style="display:flex;align-items:center;gap:10px;">
              <button id="bonusMinus" class="btn btn-soft btn-small" style="width:40px;height:40px;padding:0;font-size:1.2rem;border-radius:50%;" ${pending <= 0 ? 'disabled' : ''}>−</button>
              <span id="bonusCount" style="font-size:1.6rem;font-weight:800;min-width:36px;text-align:center;">${pending}</span>
              <button id="bonusPlus" class="btn btn-soft btn-small" style="width:40px;height:40px;padding:0;font-size:1.2rem;border-radius:50%;">＋</button>
            </div>
          </div>
          <div style="font-size:0.82rem;color:var(--muted);text-align:center;">
            Totale pacchetto: <strong style="color:var(--text);">${newTotal} lezioni</strong>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:4px;">
            <button id="bonusAnnullaBtn" class="btn btn-ghost btn-small">Annulla</button>
            <button id="bonusConfirmBtn" class="btn btn-primary btn-small" ${pending === current ? 'disabled style="opacity:.45;"' : ''}>
              ${pending === 0 && current > 0 ? 'Rimuovi bonus' : `Conferma ${pending > 0 ? '(+' + pending + ')' : ''}`}
            </button>
          </div>
        `;
        document.getElementById('bonusMinus').addEventListener('click', () => { pending = Math.max(0, pending - 1); renderBonusContent(); });
        document.getElementById('bonusPlus').addEventListener('click', () => { pending += 1; renderBonusContent(); });
        document.getElementById('bonusAnnullaBtn')?.addEventListener('click', () => closeModal('bonusLessonsModalBackdrop'));
        document.getElementById('bonusConfirmBtn')?.addEventListener('click', () => {
          plan.bonusLessons = pending;
          saveState(true);
          renderAfterClientFocus();
          closeModal('bonusLessonsModalBackdrop');
          const msg = pending === 0
            ? 'Lezioni bonus rimosse.'
            : `${pending} lezione${pending > 1 ? 'i' : ''} bonus aggiunta${pending > 1 ? 'e' : ''}.`;
          showToast(msg, 'ok');
        });
      }

      renderBonusContent();
      openModal('bonusLessonsModalBackdrop');
    }

    /* ── Modal pagamento rapido ──────────────────────── */
    function openPaymentQuickModal() {
      const client = getClient(state.selectedClientId);
      if (!client || client.paymentStatus === 'paid') return;
      renderPaymentQuickModal(client);
      openModal('paymentQuickModalBackdrop');
    }

    function renderPaymentQuickModal(client) {
      const title = document.getElementById('paymentQuickTitle');
      const sub = document.getElementById('paymentQuickSub');
      const content = document.getElementById('paymentQuickContent');
      if (!content) return;

      const isInstallments = client.paymentMode === 'installments';
      const total = Math.min(3, Math.max(1, Number(client.installmentsTotal || 2)));
      const paid = Number(client.installmentsPaid || 0);

      if (title) title.textContent = isInstallments ? 'Pagamento a rate' : 'Pagamento';
      if (sub) sub.textContent = escapeHtml(getClientFullName(client));

      if (!isInstallments) {
        // Pagamento unica soluzione
        content.innerHTML = `
          <div style="font-size:0.95rem;color:rgba(255,255,255,0.75);">Stato attuale: <strong>DA PAGARE</strong></div>
          <div class="inline-actions">
            <button class="btn btn-good" id="pqMarkPaidBtn">✓ Saldato</button>
            <button class="btn btn-ghost btn-small" data-close="paymentQuickModalBackdrop">Annulla</button>
          </div>`;
        document.getElementById('pqMarkPaidBtn')?.addEventListener('click', () => {
          client.paymentStatus = 'paid';
          pushClientPaymentSnapshot(client, 'update');
          saveState(true); renderAfterPaymentChange();
          closeModal('paymentQuickModalBackdrop');
          showToast('Pagamento saldato.', 'ok');
        });
      } else {
        // Pagamento a rate — max 3
        const rateButtons = Array.from({ length: total }, (_, i) => i + 1).map(n => `
          <button class="btn ${n === total ? 'btn-good' : 'btn-soft'} ${paid >= n ? 'active' : ''}"
            data-pq-rate="${n}" ${paid >= n ? 'style="opacity:.45;pointer-events:none;"' : ''}>
            ${n === total ? `✓ ${n} rate — tutto saldato` : `${n} ${n === 1 ? 'rata' : 'rate'} pagate`}
          </button>`).join('');

        content.innerHTML = `
          <div style="font-size:0.95rem;color:rgba(255,255,255,0.75);">
            Rate pagate: <strong>${paid} / ${total}</strong>
          </div>
          <div style="display:grid;gap:8px;">${rateButtons}</div>
          <button class="btn btn-ghost btn-small" data-close="paymentQuickModalBackdrop">Annulla</button>`;

        content.querySelectorAll('[data-pq-rate]').forEach(btn => {
          btn.addEventListener('click', () => {
            const n = Number(btn.getAttribute('data-pq-rate'));
            client.installmentsPaid = n;
            client.paymentStatus = n >= total ? 'paid' : 'partial';
            pushClientPaymentSnapshot(client, 'update');
            saveState(true); renderAfterPaymentChange();
            closeModal('paymentQuickModalBackdrop');
            const msg = n >= total ? 'Tutto saldato.' : `${n} ${n === 1 ? 'rata' : 'rate'} registrate.`;
            showToast(msg, 'ok');
          });
        });
      }
    }

    /* ── Modal completamento lezioni ─────────────────── */
    function renderCompletamentoModal() {
      const el_content = document.getElementById('completamentoModalContent');
      const el_sub = document.getElementById('completamentoModalSub');
      if (!el_content) return;
      const monthDate = state.viewDate;
      const lessons = state.lessons.filter(item => sameMonth(fromISO(item.date), monthDate));
      const done = lessons.filter(l => l.status === 'done');
      const cancelled = lessons.filter(l => l.status === 'cancelled');
      const scheduled = lessons.filter(l => l.status === 'scheduled');
      if (el_sub) el_sub.textContent = `${formatMonthLabel(monthDate)} · ${done.length} svolte · ${cancelled.length} annullate`;
      if (!lessons.length) {
        el_content.innerHTML = '<div style="padding:10px 0;color:rgba(255,255,255,0.55);font-size:0.88rem;">Nessuna lezione in questo mese.</div>';
        return;
      }
      const rows = [...done, ...scheduled, ...cancelled];
      el_content.innerHTML = rows.map(lesson => {
        const client = getClient(lesson.clientId);
        const statusIcon = lesson.status === 'done' ? '✓' : lesson.status === 'cancelled' ? '✕' : '·';
        const statusCls = lesson.status === 'done' ? 'color:#1db954' : lesson.status === 'cancelled' ? 'color:#ef4444;opacity:.7' : 'color:rgba(255,255,255,.55)';
        return `<div class="ops-alert-row" style="cursor:default;">
          <div class="ops-alert-info">
            <span class="ops-alert-icon" style="${statusCls};font-weight:900;">${statusIcon}</span>
            <div>
              <div class="ops-alert-name">${escapeHtml(getClientFullName(client) || 'Cliente')}</div>
              <div class="ops-alert-text">${escapeHtml(formatDateFancy(lesson.date))} · ${escapeHtml(lesson.time)}</div>
            </div>
          </div>
        </div>`;
      }).join('');
    }

    /* ── Modal avvisi operativi ───────────────────────── */
    function renderOperazioniModal() {
      const el_content = document.getElementById('operazioniModalContent');
      if (!el_content) return;
      const alerts = getAlerts();
      if (!alerts.length) {
        el_content.innerHTML = '<div style="padding:10px 0;color:rgba(255,255,255,0.55);font-size:0.88rem;">Nessun avviso operativo — tutto sotto controllo.</div>';
        return;
      }
      el_content.innerHTML = alerts.map(alert => {
        const client = getClient(alert.clientId);
        const typeLabel = alert.type === 'renewal' ? '🔄' : alert.type === 'payment' ? '💰' : alert.type === 'followup' ? '📞' : '⚠️';
        const tone = alert.type === 'payment' ? 'payment' : alert.type === 'renewal' ? 'renewal' : 'followup';
        return `<div class="ops-alert-row ${tone}" data-alert-row="${escapeHtml(alert.alertId)}">
          <div class="ops-alert-info">
            <span class="ops-alert-icon">${typeLabel}</span>
            <div>
              <div class="ops-alert-name">${escapeHtml(getClientFullName(client) || 'Cliente')}</div>
              <div class="ops-alert-text">${escapeHtml(alert.text || '')}</div>
            </div>
          </div>
          <div class="ops-alert-actions">
            ${client ? `<button class="btn btn-ghost btn-small" data-ops-client="${client.id}">Apri</button>` : ''}
            <button class="btn btn-ghost btn-small" data-dismiss-alert="${escapeHtml(alert.alertId)}" title="Chiudi avviso">✕</button>
          </div>
        </div>`;
      }).join('');
      el_content.querySelectorAll('[data-ops-client]').forEach(btn => {
        btn.addEventListener('click', () => {
          focusClient(btn.getAttribute('data-ops-client'));
          saveState(); renderAfterClientFocus();
          closeModal('operazioniModalBackdrop');
        });
      });
      el_content.querySelectorAll('[data-dismiss-alert]').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-dismiss-alert');
          if (!Array.isArray(state.dismissedAlerts)) state.dismissedAlerts = [];
          if (!state.dismissedAlerts.includes(id)) state.dismissedAlerts.push(id);
          saveState(true);
          renderAfterPaymentChange();
          renderOperazioniModal();
        });
      });
    }

    /* ── Modal clienti a rischio ───────────────────────── */
    function renderAtRiskModal() {
      const el_content = document.getElementById('atRiskModalContent');
      if (!el_content) return;
      const unpaidClients = state.clients.filter(c => isManagedClient(c) && (c.paymentStatus || 'unpaid') !== 'paid');
      const titleEl = document.getElementById('atRiskModalTitle');
      if (titleEl) titleEl.textContent = unpaidClients.length ? `Clienti a rischio (${unpaidClients.length})` : 'Clienti a rischio';
      if (!unpaidClients.length) {
        el_content.innerHTML = '<div style="padding:10px 0;color:rgba(255,255,255,0.55);font-size:0.88rem;">Nessun incasso aperto — tutto saldato.</div>';
        return;
      }
      el_content.innerHTML = unpaidClients.map(client => {
        const statusLabel = getPaymentStatusLabel(client.paymentStatus || 'unpaid');
        const modeLabel = client.paymentMode === 'installments'
          ? ` · Rate ${client.installmentsPaid || 0}/${client.installmentsTotal || 2}`
          : '';
        const plan = getActivePlan(client.id);
        const pkg = getPackage(plan?.packageId);
        return `<div class="ops-alert-row payment">
          <div class="ops-alert-info">
            <span class="ops-alert-icon">💰</span>
            <div>
              <div class="ops-alert-name">${escapeHtml(getClientFullName(client))}</div>
              <div class="ops-alert-text">${escapeHtml(statusLabel)}${modeLabel}${pkg ? ` · ${escapeHtml(pkg.name)}` : ''}</div>
            </div>
          </div>
          <button class="btn btn-ghost btn-small" data-risk-client="${client.id}">Apri</button>
        </div>`;
      }).join('');
      el_content.querySelectorAll('[data-risk-client]').forEach(btn => {
        btn.addEventListener('click', () => {
          focusClient(btn.getAttribute('data-risk-client'));
          saveState(); renderAfterClientFocus();
          closeModal('atRiskModalBackdrop');
        });
      });
    }

    function renderOperationalBoard() {
      if (!el.opsBoard) return;
      const cards = getOperationalActionCards();
      el.opsBoard.innerHTML = cards.map(item => `
        <button class="ops-card is-${item.tone}" type="button"
          data-action="${escapeHtml(item.action || 'noop')}"
          ${item.clientId ? `data-client-id="${item.clientId}"` : ''}
          ${item.date ? `data-date="${item.date}"` : ''}>
          <div class="k">${escapeHtml(item.label)}</div>
          <div class="v">${escapeHtml(String(item.value || '—'))}</div>
          <div class="s">${escapeHtml(String(item.sub || ''))}</div>
          <span class="meta">${escapeHtml(String(item.meta || 'Apri'))}</span>
        </button>
      `).join('');
      el.opsBoard.querySelectorAll('[data-action]').forEach(button => {
        button.addEventListener('click', () => handleOperationalAction(button));
      });
    }

    function renderSelectedClient() {
      const client = getClient(state.selectedClientId);
      if (!client) {
        const emptyHtml = `
          <div class="mobile-empty-card">
            <div class="selected-name">Nessun cliente selezionato</div>
            <div class="muted small" style="margin-top:6px;">Apri un cliente dalla lista per vedere stato, prossima sessione e azioni rapide.</div>
          </div>
        `;
        el.selectedClientCard.innerHTML = `
          <div class="selected-name">Nessun cliente</div>
          <div class="muted">Apri + Cliente per iniziare.</div>
        `;
        if (el.mobileSelectedClientCard) el.mobileSelectedClientCard.innerHTML = emptyHtml;
        return;
      }
      const plan = getActivePlan(client.id);
      const pkg = getPackage(plan?.packageId);
      const stats = planStats(plan);
      const history = clientHistoryStats(client.id);
      const nextLesson = stats.nextLesson ? `${formatDateFancy(stats.nextLesson.date)} · ${stats.nextLesson.time}` : 'Nessuna lezione futura';
      const paymentLabel = getPaymentStatusLabel(client.paymentStatus || 'unpaid');
      const health = getClientHealth(client);
      const avgSessionValue = stats.total ? formatCurrency(getPlanTotalPrice(plan, pkg, client) / Math.max(stats.total, 1)) : '—';
      const scheduleLabel = client.scheduleMode === 'same' ? 'Pianificazione fissa' : 'Pianificazione variabile';
      const serviceLabel = serviceTypeLabel(getClientServiceType(client));
      const fixedTimeLabel = client.fixedTime ? `Orario base ${escapeHtml(client.fixedTime)}` : 'Programmazione flessibile';
      const progressTags = `
        <span class="tag">${stats.done}/${stats.total} svolte</span>
        <span class="tag ${stats.remaining <= 3 ? 'gold' : ''}">${stats.remaining} rimaste${stats.bonus > 0 ? ` <span style="color:var(--good);font-size:0.75em;">+${stats.bonus} bonus</span>` : ''}</span>
        <span class="tag ${client.paymentStatus === 'paid' ? 'green' : client.paymentStatus === 'partial' ? 'gold' : 'red'}${client.paymentStatus !== 'paid' ? ' stat-box-clickable' : ''}" style="${client.paymentStatus !== 'paid' ? 'cursor:pointer;' : ''}" id="paymentStatusTag" data-open-payment="1">${escapeHtml(paymentLabel)}${client.paymentStatus !== 'paid' ? ' ›' : ''}</span>
        <span class="tag">${history.cancelled} annullate</span>
      `;
      el.selectedClientCard.innerHTML = `
        <div class="selected-card-head">
          <div style="min-width:0;">
            <div class="selected-name">${escapeHtml(getClientFullName(client))}</div>
            <div class="selected-pill-row">
              <span class="tag ${client.scheduleMode === 'same' ? 'blue' : ''}">${scheduleLabel}</span>
              <span class="tag gold">${escapeHtml(serviceLabel)}</span>
            </div>
          </div>
          <div class="selected-card-actions">
            <button class="btn btn-tertiary btn-small" id="heroCopyAppointmentsBtn" title="Copia appuntamenti" style="flex-shrink:0;font-size:0.76rem;padding:8px 12px;">Copia appuntamenti</button>
          </div>
        </div>
        <div class="selected-metrics">
          <div class="metric-tile" id="packageMetricTile" style="cursor:pointer;" title="Modifica pacchetti"><div class="k">Pacchetto ›</div><div class="v">${escapeHtml(compactPackageLabel(pkg))}</div><div class="subline">${pkg ? escapeHtml(sessionPerWeekLabel(pkg.perWeek)) : 'Nessun pacchetto attivo'}</div></div>
          <div class="metric-tile"><div class="k">Prossima sessione</div><div class="v is-small">${escapeHtml(nextLesson)}</div><div class="subline">${fixedTimeLabel}</div></div>
          <div class="metric-tile"><div class="k">Stato</div><div class="v is-accent">${escapeHtml(health)}</div><div class="subline">${escapeHtml(paymentLabel)}</div></div>
          <div class="metric-tile"><div class="k">Valore medio</div><div class="v">${escapeHtml(avgSessionValue)}</div><div class="subline">per sessione</div></div>
        </div>
        <div>
          <div class="small muted">Avanzamento percorso</div>
          <div class="progress" style="margin-top:8px;"><span style="width:${stats.progress}%"></span></div>
          <div class="pill-row" style="margin-top:10px;">
            ${progressTags}
          </div>
        </div>
        <div class="section-block timeline-block">
          <div class="timeline-head">
            <div class="timeline-title">Timeline cliente</div>
            <span class="tag compact ${stats.remaining <= 3 ? 'gold' : 'blue'}">${stats.remaining} residue</span>
          </div>
          <div class="timeline-list">
            ${getClientTimelineEntries(client).map(item => `
              <div class="timeline-item">
                <span class="timeline-dot ${item.tone}"></span>
                <div class="timeline-content">
                  <strong>${escapeHtml(item.title)}</strong>
                  <span>${escapeHtml(item.text)}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="inline-actions">
          <button class="btn btn-soft btn-small" id="editClientBtn">Modifica</button>
          <button class="btn btn-primary btn-small" id="renewClientBtn">Rinnova</button>
          <button class="btn btn-soft btn-small" id="pianificaBtn" title="Pianifica tutte le lezioni rimanenti">📅 Pianifica</button>
          <button class="btn btn-soft btn-small" id="bonusLessonsBtn" title="Aggiungi lezioni bonus al pacchetto">＋ Bonus</button>
          <button class="btn btn-soft btn-small" id="sharePortalBtn" title="Invia link portale al cliente">🔗 Portale</button>
        </div>
        <div id="clientMessagesPanel" style="display:none;margin-top:4px;"></div>
      `;
      if (el.mobileSelectedClientCard) {
        el.mobileSelectedClientCard.innerHTML = `
          <div class="mobile-selected-top">
            <div style="min-width:0;">
              <div class="mobile-selected-title">${escapeHtml(getClientFullName(client))}</div>
              <div class="mobile-selected-sub">${escapeHtml(serviceLabel)} · ${scheduleLabel}</div>
            </div>
            <button class="btn btn-tertiary btn-small" id="mobileCopyAppointmentsBtn" type="button">Copia</button>
          </div>
          <div class="selected-pill-row">
            <span class="tag ${client.paymentStatus === 'paid' ? 'green' : client.paymentStatus === 'partial' ? 'gold' : 'red'}${client.paymentStatus !== 'paid' ? ' stat-box-clickable' : ''}" style="${client.paymentStatus !== 'paid' ? 'cursor:pointer;' : ''}" id="mobilePaymentStatusTag" data-open-payment="1">${escapeHtml(paymentLabel)}${client.paymentStatus !== 'paid' ? ' ›' : ''}</span>
            <span class="tag ${stats.remaining <= 3 ? 'gold' : ''}">${stats.remaining} rimaste${stats.bonus > 0 ? ` <span style="color:var(--good);font-size:0.75em;">+${stats.bonus} bonus</span>` : ''}</span>
          </div>
          <div class="mobile-kpi-row">
            <div class="mobile-kpi"><div class="k">Prossima sessione</div><div class="v">${escapeHtml(nextLesson)}</div></div>
            <div class="mobile-kpi"><div class="k">Pacchetto</div><div class="v">${escapeHtml(compactPackageLabel(pkg))}</div></div>
            <div class="mobile-kpi"><div class="k">Avanzamento</div><div class="v">${stats.done}/${stats.total} svolte</div></div>
            <div class="mobile-kpi"><div class="k">Valore medio</div><div class="v">${escapeHtml(avgSessionValue)}</div></div>
          </div>
          <div class="section-block timeline-block">
            <div class="timeline-title">Timeline</div>
            <div class="timeline-list">
              ${getClientTimelineEntries(client).slice(0,3).map(item => `
                <div class="timeline-item">
                  <span class="timeline-dot ${item.tone}"></span>
                  <div class="timeline-content">
                    <strong>${escapeHtml(item.title)}</strong>
                    <span>${escapeHtml(item.text)}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
          <div class="mobile-selected-progress">
            <div class="small muted">Avanzamento percorso</div>
            <div class="progress" style="margin-top:8px;"><span style="width:${stats.progress}%"></span></div>
          </div>
          <div class="mobile-selected-actions">
            <button class="btn btn-soft btn-small" id="mobileEditClientBtn" type="button">Modifica cliente</button>
            <button class="btn btn-primary btn-small" id="mobileRenewClientBtn" type="button">Rinnova pacchetto</button>
            <button class="btn btn-soft btn-small" id="mobilePianificaBtn" type="button">📅 Pianifica</button>
            <button class="btn btn-soft btn-small" id="mobileBonusLessonsBtn" type="button">＋ Bonus</button>
            <button class="btn btn-soft btn-small" id="mobileSharePortalBtn" type="button">🔗 Portale</button>
            <button class="btn btn-soft btn-small" id="mobileMsgClientBtn" type="button" style="position:relative;">
              💬 Messaggi
              <span class="msg-badge" id="msgBadgeClientCard" style="top:-6px;right:-6px;">0</span>
            </button>
          </div>
        `;
      }

      const copyAppointments = () => {
        const text = buildAppointmentsText(client.id);
        if (!text) { showToast('Nessun appuntamento da copiare.'); return; }
        if (navigator.share) {
          navigator.share({ title: `Appuntamenti ${getClientFullName(client)}`, text })
            .then(() => showToast('Appuntamenti condivisi!', 'ok'))
            .catch(err => { if (err.name !== 'AbortError') showToast('Condivisione annullata.'); });
          return;
        }
        navigator.clipboard.writeText(text).then(() => {
          showToast('Appuntamenti copiati!', 'ok');
        }).catch(() => {
          const ta = document.createElement('textarea');
          ta.value = text;
          ta.style.cssText = 'position:fixed;opacity:0;';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          ta.remove();
          showToast('Appuntamenti copiati!', 'ok');
        });
      };

      document.getElementById('heroCopyAppointmentsBtn').addEventListener('click', copyAppointments);
      // Tag pagamento cliccabile (desktop e mobile)
      document.getElementById('paymentStatusTag')?.addEventListener('click', openPaymentQuickModal);
      document.getElementById('mobilePaymentStatusTag')?.addEventListener('click', openPaymentQuickModal);
      document.getElementById('editClientBtn').addEventListener('click', () => renderClientModal(client));
      document.getElementById('packageMetricTile')?.addEventListener('click', () => { renderPackages(); openModal('packagesModalBackdrop'); });
      document.getElementById('renewClientBtn').addEventListener('click', openRenewModal);
      document.getElementById('pianificaBtn')?.addEventListener('click', openPianificaModal);
      document.getElementById('bonusLessonsBtn')?.addEventListener('click', openBonusLessonsModal);
      document.getElementById('mobileBonusLessonsBtn')?.addEventListener('click', openBonusLessonsModal);
      document.getElementById('mobilePianificaBtn')?.addEventListener('click', openPianificaModal);

      /* Portale cliente — apre il portale + condividi link */
      const sharePortalFn = () => {
        if (!client.shareToken) { showToast('Token non trovato, modifica e salva il cliente.', 'warn'); return; }
        const url = clientPortalUrl(client.shareToken);
        /* Apre il portale in una nuova scheda */
        window.open(url, '_blank');
        haptic(8);
      };
      const sharePortalLinkFn = () => {
        if (!client.shareToken) return;
        const url = clientPortalUrl(client.shareToken);
        if (navigator.share) {
          navigator.share({ title: `DSWORLD — Portale di ${getClientFullName(client)}`, url })
            .catch(e => { if (e.name !== 'AbortError') navigator.clipboard.writeText(url).then(() => showToast('Link copiato!', 'ok')); });
        } else {
          navigator.clipboard.writeText(url).then(() => showToast('Link copiato!', 'ok'))
            .catch(() => showToast('Link: ' + url));
        }
        haptic(8);
      };
      document.getElementById('sharePortalBtn')?.addEventListener('click', sharePortalLinkFn);
      document.getElementById('mobileSharePortalBtn')?.addEventListener('click', sharePortalLinkFn);

      /* Carica messaggi del cliente */
      loadClientMessages(client);
      const nextAgendaDate = stats.nextLesson?.date || todayISO();
      const openDayForClient = () => {
        state.selectedDay = nextAgendaDate;
        state.viewDate = startOfMonth(fromISO(nextAgendaDate));
        state.calendarView = 'day';
        saveState();
        renderAfterCalendarNavigation();
      };
      if (document.getElementById('mobileCopyAppointmentsBtn')) document.getElementById('mobileCopyAppointmentsBtn').addEventListener('click', copyAppointments);
      if (document.getElementById('mobileEditClientBtn')) document.getElementById('mobileEditClientBtn').addEventListener('click', () => renderClientModal(client));
      if (document.getElementById('mobileRenewClientBtn')) document.getElementById('mobileRenewClientBtn').addEventListener('click', openRenewModal);
      if (document.getElementById('mobileMsgClientBtn')) document.getElementById('mobileMsgClientBtn').addEventListener('click', () => openMessagesModal(client.id));
    }

    function renderAlerts() {
      const alerts = getAlerts();
      const visibleAlerts = state.heroAlertsExpanded ? alerts.slice(0, 6) : alerts.slice(0, 3);
      if (!alerts.length) {
        el.alertStrip.innerHTML = '<div class="alert-strip-head"><span>Avvisi operativi</span></div><div class="alert-stack"><div class="alert-chip"><strong>Nessun avviso operativo</strong><span>Tutto sotto controllo.</span></div></div>';
        return;
      }
      const hiddenCount = Math.max(0, alerts.length - visibleAlerts.length);
      el.alertStrip.innerHTML = `
        <div class="alert-strip-head">
          <span>Avvisi operativi</span>
          ${alerts.length > 3 ? `<button class="text-link-btn" data-toggle-alerts="1" type="button">${state.heroAlertsExpanded ? 'Mostra meno' : `Mostra tutti (${alerts.length})`}</button>` : ''}
        </div>
        <div class="alert-stack">
          ${visibleAlerts.map(alert => {
            const typeClass = alert.type === 'check' ? 'check' : alert.type === 'renewal' ? 'renewal' : alert.type === 'payment' ? 'payment' : 'followup';
            const client = getClient(alert.clientId);
            const title = client ? getClientFullName(client) : 'Cliente';
            return `<button class="alert-chip ${typeClass}" data-alert-client="${alert.clientId}" style="text-align:left;cursor:pointer;border-right-color:rgba(255,255,255,0.06);border-top-color:rgba(255,255,255,0.06);border-bottom-color:rgba(255,255,255,0.06);" title="Apri cliente ${escapeHtml(title)}"><strong>${escapeHtml(title)}</strong><span>${escapeHtml(alert.text)}</span></button>`;
          }).join('')}
          ${hiddenCount && !state.heroAlertsExpanded ? `<div class="calendar-more">+${hiddenCount} altri avvisi disponibili</div>` : ''}
        </div>
      `;
    }

    function getClientUrgency(client) {
      const plan = getActivePlan(client.id);
      const stats = planStats(plan);
      const needsAttention = (client.paymentStatus || 'unpaid') !== 'paid' || stats.remaining <= 3;
      const highAttention = (client.paymentStatus || 'unpaid') === 'unpaid' || (stats.cancelled || 0) >= 3;
      const nextLesson = stats.nextLesson ? `${formatDateFancy(stats.nextLesson.date)} · ${stats.nextLesson.time}` : 'Nessuna lezione';
      return {
        level: highAttention ? 'bad' : needsAttention ? 'warn' : 'ok',
        nextLesson,
        remaining: stats.remaining,
        done: stats.done,
        total: stats.total
      };
    }

    function buildClientListMarkup(sortedClients, urgencyMap = null) {
      return sortedClients.map((client, idx) => {
        const activePlan = getActivePlan(client.id);
        const pkg = getPackage(activePlan?.packageId);
        const packageName = getClientOfferLabel(client, activePlan, pkg);
        const urgency = urgencyMap ? urgencyMap.get(client.id) : getClientUrgency(client);
        const revenue = activePlan ? formatCurrency(getPlanTotalPrice(activePlan, pkg, client)) : '—';
        return `
          <div class="client-card ${client.id === state.selectedClientId ? 'active' : ''}" data-client-id="${client.id}" tabindex="0" role="button" aria-label="Apri cliente ${escapeHtml(getClientFullName(client))}" style="--i:${Math.min(idx, 12)}">
            <div class="client-meta-row">
              <div style="display:flex;gap:10px;align-items:center;min-width:0;flex:1 1 auto;">
                <div class="avatar">${escapeHtml(initials(getClientFullName(client)))}</div>
                <div class="client-meta-grid">
                  <strong style="display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHtml(getClientFullName(client))}</strong>
                  <div class="small muted" style="text-transform:uppercase;line-height:1.2;">${escapeHtml(packageName)}</div>
                </div>
              </div>
            </div>
            <div class="client-subgrid">
              <div class="client-submeta">
                <span>${escapeHtml(urgency.nextLesson)}</span>
                <span>${urgency.done}/${urgency.total}</span>
              </div>
              <div class="client-data-points">
                <div class="client-data-point">
                  <span>Residuo</span>
                  <strong>${urgency.remaining} sessioni</strong>
                </div>
                <div class="client-data-point">
                  <span>Valore</span>
                  <strong>${escapeHtml(revenue)}</strong>
                </div>
              </div>
            </div>
            <div class="client-utility-row">
              <span class="tag compact ${client.paymentStatus === 'paid' ? 'green' : client.paymentStatus === 'partial' ? 'gold' : 'red'}">${escapeHtml(getPaymentStatusLabel(client.paymentStatus || 'unpaid'))}</span>
              <span class="tag compact ${getClientServiceType(client) === 'personal' ? 'blue' : ''}">${escapeHtml(serviceTypeLabel(getClientServiceType(client)))}</span>
            </div>
          </div>
        `;
      }).join('');
    }

    function showClientSkeletons(count = 5) {
      const html = Array.from({ length: count }, () => `
        <div class="skeleton-card">
          <div style="display:flex;gap:10px;align-items:center;">
            <div class="skeleton-line" style="width:40px;height:40px;border-radius:50%;flex-shrink:0;"></div>
            <div style="flex:1;display:grid;gap:7px;">
              <div class="skeleton-line" style="height:13px;width:65%;"></div>
              <div class="skeleton-line" style="height:11px;width:40%;"></div>
            </div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
            <div class="skeleton-line" style="height:11px;"></div>
            <div class="skeleton-line" style="height:11px;"></div>
          </div>
        </div>`).join('');
      if (el.clientList) el.clientList.innerHTML = html;
      const drawerList = document.getElementById('clientListDrawer');
      if (drawerList) drawerList.innerHTML = html;
    }

    function renderClientList() {
      const q = state.search.trim().toLowerCase();
      /* Pre-calcola urgency una volta sola per ogni cliente — evita O(n log n) chiamate a planStats */
      const urgencyMap = new Map(state.clients.map(c => [c.id, getClientUrgency(c)]));
      const clients = state.clients.filter(client => {
        const urgency = urgencyMap.get(client.id);
        const serviceType = getClientServiceType(client);
        const matchesQuery = !q || getClientFullName(client).toLowerCase().includes(q) || String(client.phone || '').toLowerCase().includes(q) || String(client.notes || '').toLowerCase().includes(q) || serviceTypeLabel(serviceType).toLowerCase().includes(q);
        if (!matchesQuery) return false;
        if (state.clientFilter === 'urgent') return isManagedClient(client) && (urgency.level === 'bad' || urgency.level === 'warn');
        if (state.clientFilter === 'expiring') return isManagedClient(client) && urgency.remaining > 0 && urgency.remaining <= 3;
        if (state.clientFilter === 'unpaid') return isManagedClient(client) && (client.paymentStatus || 'unpaid') !== 'paid';
        if (state.clientFilter === 'free_session') return serviceType === 'free_session';
        return true;
      });
      const sortedClients = clients.slice().sort((a, b) => {
        const ua = urgencyMap.get(a.id);
        const ub = urgencyMap.get(b.id);
        const score = level => level === 'bad' ? 2 : level === 'warn' ? 1 : 0;
        return score(ub.level) - score(ua.level) || ua.remaining - ub.remaining || getClientFullName(a).localeCompare(getClientFullName(b));
      });
      el.clientCountTag.textContent = clients.length;
      if (el.clientFilterRow) {
        el.clientFilterRow.querySelectorAll('[data-client-filter]').forEach(button => {
          button.classList.toggle('active', button.getAttribute('data-client-filter') === state.clientFilter);
        });
      }
      const drawerCountTag = document.getElementById('clientCountTagDrawer');
      if (drawerCountTag) drawerCountTag.textContent = String(clients.length);
      if (!sortedClients.length) {
        const isFiltered = state.clientFilter !== 'all' || state.search.trim();
        const emptyMarkup = isFiltered
          ? '<div class="empty">Nessun cliente trovato</div>'
          : `<div class="empty" style="padding:24px 16px;display:grid;gap:12px;text-align:center;">
               <div style="font-size:2rem;">👤</div>
               <div style="font-weight:700;color:#fff;">Nessun cliente ancora</div>
               <div style="font-size:0.88rem;color:var(--muted);line-height:1.45;">Usa il pulsante + Cliente per iniziare a gestire lezioni e pacchetti.</div>
             </div>`;
        el.clientList.innerHTML = emptyMarkup;
        const drawerList = document.getElementById('clientListDrawer');
        if (drawerList) drawerList.innerHTML = emptyMarkup;
        return;
      }
      const markup = buildClientListMarkup(sortedClients, urgencyMap);
      el.clientList.innerHTML = markup;
      hydrateClientQuickActions(el.clientList);
      const drawerList = document.getElementById('clientListDrawer');
      if (drawerList) {
        drawerList.innerHTML = markup;
        hydrateClientQuickActions(drawerList);
      }
    }

    function getCalendarAnchorDate() {
      if (state.calendarView === 'month') return startOfMonth(state.viewDate);
      return fromISO(state.selectedDay || todayISO());
    }

    /* saveState debouncato per la navigazione calendario — evita write a localStorage
       ad ogni tap freccia. Il salvataggio avviene 1.2s dopo l'ultimo movimento. */
    let _calSaveTimer = null;
    function debouncedCalendarSave() {
      clearTimeout(_calSaveTimer);
      _calSaveTimer = setTimeout(() => saveState(), 1200);
    }

    function setCalendarView(view) {
      state.calendarView = ['month', 'week', 'day'].includes(view) ? view : 'month';
      if (!state.selectedDay) state.selectedDay = todayISO();
      debouncedCalendarSave();
      renderAfterCalendarNavigation();
    }

    function moveCalendar(step) {
      if (state.calendarView === 'month') {
        state.viewDate = addMonths(state.viewDate, step);
      } else if (state.calendarView === 'week') {
        const next = addDays(getCalendarAnchorDate(), step * 7);
        state.selectedDay = toISO(next);
        state.viewDate = startOfMonth(next);
      } else {
        const next = addDays(getCalendarAnchorDate(), step);
        state.selectedDay = toISO(next);
        state.viewDate = startOfMonth(next);
      }
      debouncedCalendarSave();
      renderAfterCalendarNavigation();
    }

    function resetCalendarToToday() {
      const today = new Date();
      state.viewDate = startOfMonth(today);
      state.selectedDay = toISO(today);
      debouncedCalendarSave();
      renderAfterCalendarNavigation();
    }

    function getCalendarSearchMatches(query) {
      const q = String(query || '').trim().toLowerCase();
      if (!q) return [];
      return state.clients.filter(client => {
        const text = `${getClientFullName(client)} ${getPackage(getActivePlan(client.id)?.packageId)?.name || ''}`.toLowerCase();
        return text.includes(q);
      }).slice(0, 8);
    }

    function renderCalendarQuickSearchResults() {
      const matches = getCalendarSearchMatches(state.calendarQuickSearch);
      el.calendarQuickSearchResults.hidden = !matches.length;
      if (!matches.length) {
        el.calendarQuickSearchResults.innerHTML = '';
        return;
      }
      el.calendarQuickSearchResults.innerHTML = matches.map(client => {
        const pkg = getPackage(getActivePlan(client.id)?.packageId);
        return `<button type="button" class="quick-search-item" data-quick-client="${client.id}">
          <strong>${escapeHtml(getClientFullName(client))}</strong>
          <span class="muted small">${escapeHtml(pkg?.name || 'Senza pacchetto')}</span>
        </button>`;
      }).join('');
    }

    function buildRecurringPreviewDates({ startDate, weekdays, lessonsTotal }) {
      const selectedDays = sortWeekdays(weekdays);
      const total = Number(lessonsTotal || 0);
      if (!startDate || !selectedDays.length || !total) return [];
      const cursor = fromISO(startDate);
      const results = [];
      let attempts = 0;
      while (results.length < total && attempts < 500) {
        const iso = toISO(cursor);
        const weekday = normalizeWeekday(cursor.getDay());
        if (selectedDays.includes(weekday)) results.push(iso);
        cursor.setDate(cursor.getDate() + 1);
        attempts += 1;
      }
      return results;
    }

    function renderFixedSchedulePreview() {
      const serviceType = el.clientServiceType?.value || 'personal';
      let pkg = getPackage(el.clientPackage.value);
      if (serviceType === 'free_session') pkg = ensureSpecialPackage('free_session');
      const fixedTime = el.clientFixedTime.value;
      const fixedDays = getSelectedClientWeekdays();
      const variableSelections = getVariableScheduleSelections();
      const mode = document.querySelector('input[name="scheduleMode"]:checked')?.value || 'same';
      if (!el.fixedScheduleQuickText || !el.fixedSchedulePreview || !pkg) return;
      const previewDates = buildRecurringPreviewDates({
        startDate: el.clientStartDate.value || todayISO(),
        weekdays: mode === 'same' ? fixedDays : variableSelections.map(item => item.weekday),
        lessonsTotal: pkg.lessonsTotal
      });
      if (mode === 'same') {
        const summaryDays = fixedDays.length ? fixedDays.map(weekdayLabel).join(', ') : 'giorni da scegliere';
        const summaryTime = fixedTime || 'orario da scegliere';
        el.fixedScheduleQuickText.textContent = `Piano rapido: ${pkg.lessonsTotal} lezioni • ${summaryDays} • ${summaryTime}`;
        if (!fixedDays.length || !fixedTime) {
          el.fixedSchedulePreview.innerHTML = '<div class="muted small">Scegli ora e giorni: qui vedi subito le prime date prima di confermare.</div>';
          return;
        }
        el.fixedSchedulePreview.innerHTML = previewDates.slice(0, 6).map((iso, index) => `
          <div class="fixed-preview-item">
            <span>${index + 1}. ${escapeHtml(formatDateFancy(iso))}</span>
            <span class="tag blue">${summaryTime}</span>
          </div>
        `).join('') + (previewDates.length > 6 ? `<div class="muted small">+ altre ${previewDates.length - 6} date già pronte</div>` : '');
        return;
      }
      const summaryDays = variableSelections.length ? variableSelections.map(item => `${weekdayLabel(item.weekday)} ${item.time}`).join(' • ') : 'giorni da scegliere';
      el.fixedScheduleQuickText.textContent = `Piano rapido: ${pkg.lessonsTotal} lezioni • ${summaryDays}`;
      if (!variableSelections.length) {
        el.fixedSchedulePreview.innerHTML = '<div class="muted small">Seleziona i giorni con il relativo orario: qui vedi subito le prime date prima di confermare.</div>';
        return;
      }
      const timesByWeekday = Object.fromEntries(variableSelections.map(item => [item.weekday, item.time]));
      el.fixedSchedulePreview.innerHTML = previewDates.slice(0, 6).map((iso, index) => {
        const weekday = normalizeWeekday(fromISO(iso).getDay());
        const slotTime = timesByWeekday[weekday] || '';
        return `
          <div class="fixed-preview-item">
            <span>${index + 1}. ${escapeHtml(formatDateFancy(iso))}</span>
            <span class="tag blue">${slotTime}</span>
          </div>
        `;
      }).join('') + (previewDates.length > 6 ? `<div class="muted small">+ altre ${previewDates.length - 6} date già pronte</div>` : '');
    }

    function renderWeekAgenda(anchorDate = getCalendarAnchorDate()) {
      const monday = addDays(anchorDate, -((anchorDate.getDay() + 6) % 7));
      const weekDays = Array.from({ length: 7 }, (_, index) => addDays(monday, index));
      const hours = Array.from({ length: 15 }, (_, index) => `${String(index + 7).padStart(2, '0')}:00`);
      const isMobile = window.innerWidth <= 580;

      if (isMobile) {
        const DAY_LETTERS_WEEK = ['L','M','M','G','V','S','D'];
        const todayISOStr = todayISO();

        let weekHtml = '<div class="week-grid-mobile">';

        /* ── Corner cell ── */
        weekHtml += '<div class="wgm-corner"></div>';

        /* ── Day header cells ── */
        weekDays.forEach(day => {
          const iso = toISO(day);
          const isToday = iso === todayISOStr;
          const letter = DAY_LETTERS_WEEK[(day.getDay() + 6) % 7];
          weekHtml += `<div class="wgm-head">
            <div class="wgm-letter">${letter}</div>
            <div class="wgm-num${isToday ? ' wgm-num-today' : ''}">${day.getDate()}</div>
          </div>`;
        });

        /* ── Hour rows ── */
        hours.forEach(time => {
          /* Time label */
          weekHtml += `<div class="wgm-time">${time}</div>`;
          /* Day cells */
          weekDays.forEach(day => {
            const iso = toISO(day);
            const slotLessons = state.lessons
              .filter(item => item.date === iso && item.time.slice(0, 2) === time.slice(0, 2))
              .sort((a, b) => a.time.localeCompare(b.time));
            if (slotLessons.length) {
              const pills = slotLessons.map(lesson => `
                <button type="button" class="wgm-pill status-${lesson.status}${lesson.duoGroupId ? ' duo' : ''}" data-lesson-id="${lesson.id}">
                  <span class="wgm-pill-name">${escapeHtml(getLessonDisplayTitle(lesson))}</span>
                  <span class="wgm-pill-time">${lesson.time}</span>
                </button>
              `).join('');
              weekHtml += `<div class="wgm-cell wgm-cell-busy">${pills}</div>`;
            } else {
              weekHtml += `<div class="wgm-cell" data-add-slot="${iso}|${time}"></div>`;
            }
          });
        });

        weekHtml += '</div>';
        el.agendaWrap.innerHTML = weekHtml;

        el.agendaWrap.querySelectorAll('[data-add-slot]').forEach(cell => {
          cell.addEventListener('click', () => {
            const [iso, time] = cell.getAttribute('data-add-slot').split('|');
            addLessonFromDaySlot(iso, time);
          });
        });
        el.agendaWrap.querySelectorAll('[data-lesson-id]').forEach(button => button.addEventListener('click', () => {
          openLessonModal(button.getAttribute('data-lesson-id'));
        }));
        return;
      }

      el.agendaWrap.innerHTML = `
        <div class="agenda-week-grid">
          <div class="agenda-week-day"></div>
          ${weekDays.map(day => `<div class="agenda-week-day" data-open-day="${toISO(day)}">${escapeHtml(day.toLocaleDateString('it-IT', { weekday: 'short', day: '2-digit', month: '2-digit' }))}</div>`).join('')}
          ${hours.map(time => `
            <div class="agenda-week-time">${time}</div>
            ${weekDays.map(day => {
              const iso = toISO(day);
              const slotLessons = state.lessons
                .filter(item => item.date === iso && item.time.slice(0, 2) === time.slice(0, 2))
                .sort((a, b) => a.time.localeCompare(b.time));
              return `
                <div class="agenda-week-cell" data-week-slot="${iso}|${time}">
                  ${slotLessons.length ? slotLessons.map(lesson => {
                    const isDuo = !!lesson.duoGroupId;
                    return `<button type="button" class="lesson-pill agenda-inline-pill status-${lesson.status}${isDuo ? ' duo' : ''}" data-lesson-id="${lesson.id}">
                      <strong>${isDuo ? '👥 ' : ''}${escapeHtml(getLessonDisplayTitle(lesson))}</strong>
                      <span>${lesson.time}</span>
                    </button>`;
                  }).join('') : (getExternalBusyOverlap({ date: iso, time, duration: 60 }) ? `<div class="lesson-pill agenda-inline-pill" style="opacity:.68;cursor:not-allowed;"><strong>OCCUPATO</strong><span>${time}</span></div>` : `<button type="button" class="agenda-week-add" data-add-slot="${iso}|${time}">Slot libero</button>`)}
                </div>
              `;
            }).join('')}
          `).join('')}
        </div>
      `;
      el.agendaWrap.querySelectorAll('[data-open-day]').forEach(node => node.addEventListener('click', () => {
        state.selectedDay = node.getAttribute('data-open-day');
        state.calendarView = 'day';
        saveState();
        renderAfterCalendarNavigation();
      }));
      el.agendaWrap.querySelectorAll('[data-add-slot]').forEach(button => button.addEventListener('click', () => {
        const [iso, time] = button.getAttribute('data-add-slot').split('|');
        addLessonFromDaySlot(iso, time);
      }));
      el.agendaWrap.querySelectorAll('[data-lesson-id]').forEach(button => button.addEventListener('click', () => {
        openLessonModal(button.getAttribute('data-lesson-id'));
      }));
    }

    function renderDayAgenda(dayIso = state.selectedDay || todayISO()) {
      const dayLessons = getLessonsByDate(dayIso);
      const dayLabel = formatDateFancy(dayIso);
      const selectedClient = getClient(state.selectedClientId);
      const activePlan = selectedClient ? getActivePlan(selectedClient.id) : null;
      const selectedPackage = getPackage(activePlan?.packageId);
      const selectedDuration = Number(selectedPackage?.duration || 60);
      const slotTimes = buildDaySlotTimes();
      el.agendaWrap.innerHTML = `
        <div class="agenda-card">
          <div class="agenda-card-top">
            <div>
              <div class="agenda-hour">${escapeHtml(dayLabel)}</div>
              <div class="muted small">Vista lista del giorno con spazi liberi e lezioni fissate</div>
            </div>
            <button class="btn btn-soft btn-small" type="button" id="openSelectedDayModalBtn">Apri giornata completa</button>
          </div>
          <div class="day-slots-wrap">
            <div class="day-slots-title">Orari del giorno</div>
            <div class="day-slot-grid" id="agendaDaySlotGrid">
              ${slotTimes.map(time => {
                const exactLesson = dayLessons.find(lesson => lesson.time === time && lesson.status !== 'cancelled');
                const cancelledLesson = dayLessons.find(lesson => lesson.time === time && lesson.status === 'cancelled');
                const slotDuration = Number(exactLesson?.duration || selectedDuration || 60);
                const endTime = addMinutesToTime(time, slotDuration);
                const overlappingLesson = getOverlappingLesson({ date: dayIso, time, duration: selectedDuration || 60 });
                if (exactLesson) {
                  const statusText = exactLesson.status === 'done' ? 'Svolta' : 'Apri';
                  const duoPartnerAgenda = getDuoPartner(exactLesson);
                  const duoTagAgenda = duoPartnerAgenda ? ' 👥 DUO' : '';
                  const duoMetaAgenda = duoPartnerAgenda
                    ? `${escapeHtml(getClientFullName(getClient(exactLesson.clientId)))} + ${escapeHtml(getClientFullName(getClient(duoPartnerAgenda.clientId)))}`
                    : escapeHtml(getLessonDisplayTitle(exactLesson));
                  return `
                    <button class="day-slot exact${duoPartnerAgenda ? ' duo' : ''}" data-slot-lesson-id="${exactLesson.id}">
                      <div class="day-slot-main">
                        <div class="day-slot-time">${time} - ${endTime}${duoTagAgenda}</div>
                        <div class="day-slot-meta">${duoMetaAgenda}${exactLesson.note ? ` • ${escapeHtml(exactLesson.note)}` : ''}</div>
                      </div>
                      <span class="day-slot-state">${statusText}</span>
                    </button>
                  `;
                }
                if (overlappingLesson) {
                  const overlapExactAgenda = dayLessons.find(l => l.time === time && l.status !== 'cancelled');
                  const isHiddenDuoPartnerAgenda = overlapExactAgenda && overlapExactAgenda.duoGroupId && overlapExactAgenda.duoGroupId === overlappingLesson.duoGroupId;
                  if (isHiddenDuoPartnerAgenda) return '';
                  return `
                    <button class="day-slot busy" data-slot-lesson-id="${overlappingLesson.id}">
                      <div class="day-slot-main">
                        <div class="day-slot-time">${time} - ${endTime}</div>
                        <div class="day-slot-meta">Occupato da ${escapeHtml(getLessonDisplayTitle(overlappingLesson))} • ${overlappingLesson.time}</div>
                      </div>
                      <span class="day-slot-state">Occupato</span>
                    </button>
                  `;
                }
                const externalBusy = getExternalBusyOverlap({ date: dayIso, time, duration: selectedDuration || 60 });
                if (externalBusy) {
                  return `
                    <button class="day-slot busy" type="button" disabled>
                      <div class="day-slot-main">
                        <div class="day-slot-time">${time} - ${endTime}</div>
                        <div class="day-slot-meta">Occupato da calendario esterno</div>
                      </div>
                      <span class="day-slot-state">Occupato</span>
                    </button>
                  `;
                }
                return `
                  <button class="day-slot free" data-slot-time="${time}" ${selectedClient ? '' : 'disabled'}>
                    <div class="day-slot-main">
                      <div class="day-slot-time">${time} - ${endTime}</div>
                      <div class="day-slot-meta">${cancelledLesson ? 'Lezione annullata: slot di nuovo disponibile' : (selectedClient ? 'Inserisci qui la lezione' : 'Seleziona prima un cliente')}</div>
                    </div>
                    <span class="day-slot-state">Aggiungi</span>
                  </button>
                `;
              }).join('')}
            </div>
          </div>
          <div class="day-lessons-wrap" ${dayLessons.length ? '' : 'hidden'}>
            <div class="day-slots-title">Lezioni fissate</div>
            <div class="day-detail-list" id="agendaDayLessonList">
              ${(() => {
                const seenGroups = new Set();
                return dayLessons.filter(lesson => {
                  if (!lesson.duoGroupId) return true;
                  if (seenGroups.has(lesson.duoGroupId)) return false;
                  seenGroups.add(lesson.duoGroupId);
                  return true;
                }).map(lesson => {
                  const statusText = lesson.status === 'done' ? 'Svolta' : lesson.status === 'cancelled' ? 'Annullata' : 'Programmata';
                  return `
                    <button class="day-lesson-item" data-lesson-id="${lesson.id}">
                      <div class="day-lesson-main">
                        <strong>${escapeHtml(getLessonDisplayTitle(lesson) || 'Cliente')}</strong>
                        <div class="day-lesson-meta">${lesson.time} • ${lesson.duration || 60} min${lesson.note ? ` • ${escapeHtml(lesson.note)}` : ''}</div>
                      </div>
                      <div class="day-lesson-side">
                        <span class="day-status-chip status-${lesson.status}">${statusText}</span>
                        <span class="muted small">Apri</span>
                      </div>
                    </button>
                  `;
                }).join('');
              })()}
            </div>
            ${dayLessons.length ? '' : '<div class="day-empty">Nessuna lezione fissata in questa giornata.</div>'}
          </div>
        </div>
      `;
      const modalBtn = document.getElementById('openSelectedDayModalBtn');
      if (modalBtn) modalBtn.addEventListener('click', () => openDayModal(dayIso));
      el.agendaWrap.querySelectorAll('[data-slot-time]').forEach(button => button.addEventListener('click', () => {
        addLessonFromDaySlot(dayIso, button.getAttribute('data-slot-time'));
      }));
      el.agendaWrap.querySelectorAll('[data-slot-lesson-id]').forEach(button => button.addEventListener('click', () => {
        openLessonModal(button.getAttribute('data-slot-lesson-id'));
      }));
      el.agendaWrap.querySelectorAll('[data-lesson-id]').forEach(button => button.addEventListener('click', () => {
        openLessonModal(button.getAttribute('data-lesson-id'));
      }));
    }

    function renderCalendarHead() {
      const client = getClient(state.selectedClientId);
      const isMobileMonth = state.calendarView === 'month' && window.innerWidth <= 580;
      el.calendarViewButtons.forEach(button => {
        const isActive = button.getAttribute('data-calendar-view') === state.calendarView;
        button.classList.toggle('active', isActive);
        button.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });
      if (state.calendarView === 'month') {
        el.calendarHead.style.display = 'grid';
        el.calendarHead.innerHTML = (isMobileMonth ? ['L','M','M','G','V','S','D'] : DAYS_IT).map(day => `<div>${day}</div>`).join('');
        el.monthLabel.textContent = formatMonthLabel(state.viewDate);
      } else if (state.calendarView === 'week') {
        el.calendarHead.style.display = 'none';
        const monday = addDays(getCalendarAnchorDate(), -((getCalendarAnchorDate().getDay() + 6) % 7));
        const sunday = addDays(monday, 6);
        el.monthLabel.textContent = `Settimana ${monday.toLocaleDateString('it-IT', { day: '2-digit', month: 'short' })} - ${sunday.toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' })}`;
      } else {
        el.calendarHead.style.display = 'none';
        el.monthLabel.textContent = fromISO(state.selectedDay || todayISO()).toLocaleDateString('it-IT', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
      }
      el.calendarMeta.textContent = client ? `Cliente attivo: ${getClientFullName(client)}` : 'Nessun cliente attivo';
      if (el.calendarQuickSearch && document.activeElement !== el.calendarQuickSearch && !state.calendarQuickSearch) {
        el.calendarQuickSearch.value = client ? getClientFullName(client) : '';
      }
      renderCalendarQuickSearchResults();
    }

    function renderCalendar() {
      if (state.calendarView !== 'month') {
        el.calendarGrid.innerHTML = '';
        el.calendarGrid.style.display = 'none';
        el.calendarGrid.classList.remove('ios-month-grid');
        el.agendaWrap.hidden = false;
        if (state.calendarView === 'week') renderWeekAgenda(getCalendarAnchorDate());
        else renderDayAgenda(state.selectedDay || todayISO());
        return;
      }
      const isMobileMonth = window.innerWidth <= 580;
      el.calendarGrid.style.display = 'grid';
      el.calendarGrid.classList.toggle('ios-month-grid', isMobileMonth);
      el.agendaWrap.hidden = true;
      const first = new Date(state.viewDate.getFullYear(), state.viewDate.getMonth(), 1);
      const startOffset = (first.getDay() + 6) % 7;
      const startDate = addDays(first, -startOffset);
      const cells = [];

      for (let i = 0; i < 42; i++) {
        const date = addDays(startDate, i);
        const iso = toISO(date);
        const dayLessons = getLessonsByDate(iso);
        const isOther = date.getMonth() !== state.viewDate.getMonth();
        const isToday = iso === todayISO();
        const visibleLessons = dayLessons.slice(0, isMobileMonth ? 1 : 2);
        const hiddenLessons = Math.max(0, dayLessons.length - visibleLessons.length);
        const weekdayLetter = ['D','L','M','M','G','V','S'][date.getDay()];
        cells.push(`
          <div class="day-cell ${isOther ? 'other-month' : ''} ${isToday ? 'today' : ''} ${iso === state.selectedDay ? 'selected-day' : ''}" data-date="${iso}">
            <div class="day-top">
              <div class="day-top-main">
                ${isMobileMonth ? '' : `<div class="day-weekday">${weekdayLetter}</div>`}
                <div class="day-number">${date.getDate()}</div>
              </div>
              <button class="day-add" data-add-date="${iso}" title="Apri giorno">＋</button>
            </div>
            <div class="day-events">
              ${dayLessons.length ? visibleLessons.map(lesson => {
                const client = getClient(lesson.clientId);
                const isDuo = !!lesson.duoGroupId;
                return `
                  <button class="lesson-pill status-${lesson.status}${isDuo ? ' duo' : ''}" data-lesson-id="${lesson.id}" title="${escapeHtml(getClientFullName(client) || '')}">
                    <strong>${isDuo ? '👥 ' : ''}${escapeHtml(getLessonDisplayTitle(lesson) || 'Cliente')}</strong>
                    <span>${lesson.time}</span>
                  </button>
                `;
              }).join('') : ''}
              ${hiddenLessons ? `<div class="calendar-more">+${hiddenLessons} altre</div>` : ''}
            </div>
          </div>
        `);
      }
      el.calendarGrid.innerHTML = cells.join('');
    }

    function getLessonsByDate(date) {
      if (!derived.lessonsByDate) {
        derived.lessonsByDate = new Map();
        state.lessons.forEach(item => {
          if (!derived.lessonsByDate.has(item.date)) derived.lessonsByDate.set(item.date, []);
          derived.lessonsByDate.get(item.date).push(item);
        });
        derived.lessonsByDate.forEach((items, key) => {
          items.sort((a, b) => a.time.localeCompare(b.time) || getClientFullName(getClient(a.clientId)).localeCompare(getClientFullName(getClient(b.clientId))));
          derived.lessonsByDate.set(key, items);
        });
      }
      return derived.lessonsByDate.get(date) || [];
    }

    function openDayModal(date) {
      state.selectedDay = date;
      renderDayModal(date);
      refreshGoogleBlockingAvailability(true);
      openModal('dayModalBackdrop');
    }

    function addLessonFromDaySlot(date, time) {
      const client = getClient(state.selectedClientId);
      if (!client) {
        showToast('Seleziona un cliente.');
        return;
      }
      const plan = getNextAvailablePlan(client.id);
      const pkg = getPackage(plan?.packageId);
      if (!plan || !pkg) {
        showToast('Pacchetto mancante.');
        return;
      }
      const capacity = getPlanCapacity(plan.id);
      if (capacity.isFull) {
        showToast('Tutti i pacchetti sono completati.');
        return;
      }
      /* Informa se si sta usando il piano successivo */
      const activePlan = getActivePlan(client.id);
      if (activePlan && plan.id !== activePlan.id) {
        showToast('Pacchetto attuale completato — lezione aggiunta al pacchetto successivo.', 'warn');
      }
      if (getExternalBusyOverlap({ date, time, duration: pkg.duration })) { showToast('Slot occupato da altro calendario.', 'warn'); return; }
      const ok = createLesson({ clientId: client.id, planId: plan.id, date, time, duration: pkg.duration, setFixedTime: client.scheduleMode === 'same' });
      if (ok) {
        renderAfterLessonChange();
        renderDayModal(date);
      }
    }

    function renderDayModal(date = state.selectedDay) {
      if (!date) return;
      state.selectedDay = date;
      const dayLessons = getLessonsByDate(date);
      const dayDate = fromISO(date);
      const selectedClient = getClient(state.selectedClientId);
      const activePlan = selectedClient ? getActivePlan(selectedClient.id) : null;
      const selectedPackage = getPackage(activePlan?.packageId);
      const selectedDuration = Number(selectedPackage?.duration || 60);
      const slotTimes = buildDaySlotTimes();
      el.dayModalTitle.textContent = dayDate.toLocaleDateString('it-IT', { weekday: 'long', day: '2-digit', month: 'long' });
      el.dayModalSubtitle.textContent = selectedClient
        ? `Cliente attivo: ${getClientFullName(selectedClient)} • tocca l'orario per fissare la lezione`
        : `Apri il cliente e poi tocca l'orario desiderato`;
      el.dayAddLessonBtn.textContent = selectedClient ? 'Tocca l\'ora' : 'Seleziona cliente';
      el.dayAddLessonBtn.disabled = true;

      el.daySlotGrid.innerHTML = slotTimes.map(time => {
        const exactLesson = dayLessons.find(lesson => lesson.time === time && lesson.status !== 'cancelled');
        const cancelledLesson = dayLessons.find(lesson => lesson.time === time && lesson.status === 'cancelled');
        const slotDuration = Number(exactLesson?.duration || selectedDuration || 60);
        const endTime = addMinutesToTime(time, slotDuration);
        const overlappingLesson = getOverlappingLesson({ date, time, duration: selectedDuration || 60 });
        if (exactLesson) {
          const statusText = exactLesson.status === 'done' ? 'Svolta' : 'Apri';
          const duoPartnerSlot = getDuoPartner(exactLesson);
          const duoTag = duoPartnerSlot ? ' 👥 DUO' : '';
          const duoMeta = duoPartnerSlot
            ? `${escapeHtml(getClientFullName(getClient(exactLesson.clientId)))} + ${escapeHtml(getClientFullName(getClient(duoPartnerSlot.clientId)))}`
            : escapeHtml(getLessonDisplayTitle(exactLesson));
          return `
            <button class="day-slot exact${duoPartnerSlot ? ' duo' : ''}" data-slot-lesson-id="${exactLesson.id}">
              <div class="day-slot-main">
                <div class="day-slot-time">${time} - ${endTime}${duoTag}</div>
                <div class="day-slot-meta">${duoMeta}${exactLesson.note ? ` • ${escapeHtml(exactLesson.note)}` : ''}</div>
              </div>
              <span class="day-slot-state">${statusText}</span>
            </button>
          `;
        }
        if (overlappingLesson) {
          // Se il conflitto è la lezione-partner di un DUO già mostrata come exactLesson, salta
          const overlapExact = dayLessons.find(l => l.time === time && l.status !== 'cancelled');
          const isHiddenDuoPartner = overlapExact && overlapExact.duoGroupId && overlapExact.duoGroupId === overlappingLesson.duoGroupId;
          if (isHiddenDuoPartner) {
            // Slot già coperto dal duo: non mostrare riga separata
            return '';
          }
          return `
            <button class="day-slot busy" data-slot-lesson-id="${overlappingLesson.id}">
              <div class="day-slot-main">
                <div class="day-slot-time">${time} - ${endTime}</div>
                <div class="day-slot-meta">Occupato da ${escapeHtml(getLessonDisplayTitle(overlappingLesson))} • ${overlappingLesson.time}</div>
              </div>
              <span class="day-slot-state">Occupato</span>
            </button>
          `;
        }
        const externalBusy = getExternalBusyOverlap({ date, time, duration: selectedDuration || 60 });
        if (externalBusy) {
          return `
            <button class="day-slot busy" type="button" disabled>
              <div class="day-slot-main">
                <div class="day-slot-time">${time} - ${endTime}</div>
                <div class="day-slot-meta">Occupato da calendario esterno</div>
              </div>
              <span class="day-slot-state">Occupato</span>
            </button>
          `;
        }
        return `
          <button class="day-slot free" data-slot-time="${time}" ${selectedClient ? '' : 'disabled'}>
            <div class="day-slot-main">
              <div class="day-slot-time">${time} - ${endTime}</div>
              <div class="day-slot-meta">${cancelledLesson ? 'Lezione annullata: slot di nuovo disponibile' : (selectedClient ? 'Inserisci qui la lezione' : 'Seleziona prima un cliente')}</div>
            </div>
            <span class="day-slot-state">Aggiungi</span>
          </button>
        `;
      }).join('');

      el.daySlotGrid.querySelectorAll('[data-slot-time]').forEach(button => {
        button.addEventListener('click', () => addLessonFromDaySlot(date, button.getAttribute('data-slot-time')));
      });
      el.daySlotGrid.querySelectorAll('[data-slot-lesson-id]').forEach(button => {
        button.addEventListener('click', () => {
          closeModal('dayModalBackdrop');
          openLessonModal(button.getAttribute('data-slot-lesson-id'));
        });
      });

      el.dayLessonsWrap.hidden = !dayLessons.length;
      if (!dayLessons.length) {
        el.dayLessonList.innerHTML = '';
        return;
      }
      // Nei DUO mostra solo la lezione "primaria" (la prima del gruppo per id)
      const seenDuoGroups = new Set();
      const dayLessonsDeduped = dayLessons.filter(lesson => {
        if (!lesson.duoGroupId) return true;
        if (seenDuoGroups.has(lesson.duoGroupId)) return false;
        seenDuoGroups.add(lesson.duoGroupId);
        return true;
      });
      el.dayLessonList.innerHTML = dayLessonsDeduped.map(lesson => {
        const client = getClient(lesson.clientId);
        const statusText = lesson.status === 'done' ? 'Svolta' : lesson.status === 'cancelled' ? 'Annullata' : 'Programmata';
        return `
          <button class="day-lesson-item" data-lesson-id="${lesson.id}">
            <div class="day-lesson-main">
              <strong>${escapeHtml(getLessonDisplayTitle(lesson) || 'Cliente')}</strong>
              <div class="day-lesson-meta">${lesson.time} • ${lesson.duration || 60} min${lesson.note ? ` • ${escapeHtml(lesson.note)}` : ''}</div>
            </div>
            <div class="day-lesson-side">
              <span class="day-status-chip status-${lesson.status}">${statusText}</span>
              <span class="muted small">Apri</span>
            </div>
          </button>
        `;
      }).join('');
      el.dayLessonList.querySelectorAll('[data-lesson-id]').forEach(button => {
        button.addEventListener('click', () => {
          closeModal('dayModalBackdrop');
          openLessonModal(button.getAttribute('data-lesson-id'));
        });
      });
    }

    function selectClient(clientId) {
      state.selectedClientId = clientId;
      saveState(true);
      renderAfterClientFocus();
      /* Se è un cliente free session con lezione già svolta → proponi conversione */
      const client = getClient(clientId);
      if (client && getClientServiceType(client) === 'free_session' && client.conversionStatus !== 'path_started') {
        const hasDone = getLessonsForClient(clientId).some(l => l.status === 'done');
        if (hasDone) setTimeout(() => openFreeSessionConversionModal(client), 300);
      }
    }

    function quickAddFromDate(date) {
      openDayModal(date);
    }

    function renderTimeModal() {
      if (!state.pendingAdd) return;
      const client = getClient(state.pendingAdd.clientId);
      el.timeModalTitle.textContent = client?.scheduleMode === 'same' ? 'Primo orario' : 'Scegli orario';
      el.timeModalSubtitle.textContent = `${getClientFullName(client) || 'Cliente'} • ${formatDateFancy(state.pendingAdd.date)}`;
      const suggestions = [...new Set([...getUsualTimes(state.pendingAdd.clientId), ...getDefaultTimes()])].slice(0, 8);
      el.timeManualInput.value = state.pendingTimeValue || '';
      el.timeSuggestionChips.innerHTML = suggestions.map(time => `<button class="time-chip ${time === state.pendingTimeValue ? 'active' : ''}" data-time="${time}">${time}</button>`).join('');
      el.timeSuggestionChips.querySelectorAll('[data-time]').forEach(button => {
        button.addEventListener('click', () => {
          state.pendingTimeValue = button.getAttribute('data-time');
          el.timeManualInput.value = state.pendingTimeValue;
          renderTimeModal();
        });
      });
    }

    function createLesson({ clientId, planId, date, time, duration, setFixedTime = false, note = '', linkedTo = null, duoGroupId = null }) {
      const client = getClient(clientId);
      if (!client || !time) {
        showToast('Inserisci un orario.');
        return false;
      }
      const lessonType = lessonTypeForNewLesson(client);
      if (lessonType === 'free_session' && clientHasAnyFreeSession(clientId)) {
        showToast('Questo cliente ha già una FREE SESSION fissata o svolta.', 'warn');
        return false;
      }
      if (!canUsePlanSlot(planId)) {
        showToast('Hai raggiunto il numero massimo di lezioni del pacchetto.', 'warn');
        return false;
      }
      if (state.lessons.some(item => item.clientId === clientId && item.date === date && item.time === time && item.status !== 'cancelled')) {
        showToast('Cliente già inserito in questo slot.', 'warn');
        return false;
      }
      if (hasTimeConflict({ date, time, duration, duoGroupId })) {
        showToast('Conflitto di orario.', 'warn');
        return false;
      }
      const lesson = {
        id: uid('lesson'),
        clientId,
        planId,
        date,
        time,
        duration: Number(duration || 60),
        lessonType,
        status: 'scheduled',
        note,
        linkedTo,
        duoGroupId,
        googleEventId: '',
        createdAt: new Date().toISOString()
      };
      state.lessons.push(lesson);
      if (setFixedTime && client.scheduleMode === 'same' && !client.fixedTime) client.fixedTime = time;
      saveState(true);
      renderAfterLessonChange();
      requestGoogleLessonSync('upsert', lesson, { allowCreateWithoutEventId: true });
      showToast(`Lezione inserita: ${formatDateFancy(date)} • ${time}`);
      return lesson;
    }

    function openLessonModal(lessonId) {
      state.selectedLessonId = lessonId;
      const lesson = getLesson(lessonId);
      if (!lesson) return;
      const client = getClient(lesson.clientId);
      const plan = getPlan(lesson.planId);
      const pkg = getPackage(plan?.packageId);
      const quickTimes = [...new Set([lesson.time, client?.fixedTime, ...getUsualTimes(lesson.clientId), ...getDefaultTimes()].filter(Boolean))].slice(0, 8);
      const suggestions = getSuggestedReschedules(lesson);
      el.lessonModalTitle.textContent = getClientFullName(client) || 'Lezione';
      el.lessonModalSubtitle.textContent = `${formatDateFancy(lesson.date)} • ${pkg?.duration || lesson.duration} min`;
      el.lessonTimeInput.value = lesson.time;
      el.lessonNoteInput.value = lesson.note || '';
      el.lessonQuickTimes.innerHTML = quickTimes.map(time => `<button class="time-chip ${time === lesson.time ? 'active' : ''}" data-time="${time}">${time}</button>`).join('');
      el.lessonQuickTimes.querySelectorAll('[data-time]').forEach(button => {
        button.addEventListener('click', () => applyLessonTime(button.getAttribute('data-time')));
      });
      el.rescheduleList.innerHTML = suggestions.length ? suggestions.map(item => `
        <button class="suggestion-btn" data-date="${item.date}" data-time="${item.time}">${formatDateFancy(item.date)} • ${item.time}</button>
      `).join('') : '<div class="empty" style="grid-column:1/-1;">Nessun suggerimento</div>';
      el.rescheduleList.querySelectorAll('[data-date]').forEach(button => {
        button.addEventListener('click', () => rescheduleCancelledLesson({ date: button.getAttribute('data-date'), time: button.getAttribute('data-time') }));
      });

      // ── Sezione DUO ──────────────────────────────────────────
      const partner = getDuoPartner(lesson);
      if (partner) {
        // Ha già un partner → mostra badge e bottone scollega
        const partnerClient = getClient(partner.clientId);
        el.duoPartnerBadge.textContent = `👥 ${getClientFullName(partnerClient)}`;
        el.duoPartnerRow.style.display = 'flex';
        el.duoAddRow.style.display = 'none';
        el.duoUnlinkBtn.onclick = () => unlinkDuoLesson(lesson.id);
      } else {
        // Nessun partner → mostra selector con gli altri clienti
        el.duoPartnerRow.style.display = 'none';
        el.duoAddRow.style.display = 'grid';
        const otherClients = state.clients.filter(c => c.id !== lesson.clientId && getActivePlan(c.id));
        el.duoClientSelect.innerHTML = otherClients.length
          ? otherClients.map(c => `<option value="${c.id}">${escapeHtml(getClientFullName(c))}</option>`).join('')
          : '<option value="">Nessun cliente con pacchetto attivo</option>';
        el.duoLinkBtn.disabled = !otherClients.length;
        el.duoLinkBtn.onclick = () => {
          const selectedId = el.duoClientSelect.value;
          if (selectedId) createDuoLesson(lesson.id, selectedId);
        };
      }

      openModal('lessonModalBackdrop');
    }

    function applyLessonStatus(status) {
      const lesson = getLesson(state.selectedLessonId);
      if (!lesson) return;
      if (lesson.status === 'cancelled' && status !== 'cancelled' && !canUsePlanSlot(lesson.planId, lesson.id)) {
        showToast('Pacchetto pieno: non puoi riattivare questa lezione.', 'warn');
        return;
      }
      lesson.status = status;
      // Sincronizza stato al partner DUO
      const duoPartnerStatus = getDuoPartner(lesson);
      if (duoPartnerStatus) {
        duoPartnerStatus.status = status;
        requestGoogleLessonSync('upsert', duoPartnerStatus);
      }
      saveState(true);
      renderAfterLessonChange();
      requestGoogleLessonSync('upsert', lesson);
      openLessonModal(lesson.id);
      showToast('Stato aggiornato.', 'ok');

      /* Free session completata → apri modale conversione */
      if (status === 'done') {
        const client = getClient(lesson.clientId);
        if (client && getClientServiceType(client) === 'free_session' && client.conversionStatus !== 'path_started') {
          setTimeout(() => openFreeSessionConversionModal(client), 350);
        }
      }
    }

    function applyLessonTime(time) {
      const lesson = getLesson(state.selectedLessonId);
      if (!lesson) return;
      if (hasTimeConflict({ lessonId: lesson.id, date: lesson.date, time, duration: lesson.duration })) {
        showToast('Conflitto di orario.', 'warn');
        return;
      }
      lesson.time = time;
      const client = getClient(lesson.clientId);
      if (client?.scheduleMode === 'same') client.fixedTime = time;
      saveState(true);
      renderAfterLessonChange();
      requestGoogleLessonSync('upsert', lesson);
      openLessonModal(lesson.id);
      showToast('Orario aggiornato.', 'ok');
    }

    function saveLessonDetails() {
      const lesson = getLesson(state.selectedLessonId);
      if (!lesson) return;
      const newTime = el.lessonTimeInput.value;
      if (!newTime) {
        showToast('Inserisci un orario.');
        return;
      }
      if (hasTimeConflict({ lessonId: lesson.id, date: lesson.date, time: newTime, duration: lesson.duration })) {
        showToast('Conflitto di orario.', 'warn');
        return;
      }
      lesson.time = newTime;
      lesson.note = el.lessonNoteInput.value.trim();
      const client = getClient(lesson.clientId);
      if (client?.scheduleMode === 'same') client.fixedTime = newTime;
      // Sincronizza orario e nota al partner DUO
      const duoPartnerSave = getDuoPartner(lesson);
      if (duoPartnerSave) {
        duoPartnerSave.time = newTime;
        duoPartnerSave.note = lesson.note;
        requestGoogleLessonSync('upsert', duoPartnerSave);
      }
      saveState();
      renderAfterLessonChange();
      requestGoogleLessonSync('upsert', lesson);
      openLessonModal(lesson.id);
      showToast('Lezione salvata.', 'ok');
    }

    /* ── DUO: collega un secondo cliente a una lezione esistente ── */
    function createDuoLesson(existingLessonId, partnerClientId) {
      const existingLesson = getLesson(existingLessonId);
      if (!existingLesson) return;
      const partnerClient = getClient(partnerClientId);
      if (!partnerClient) { showToast('Cliente non trovato.', 'warn'); return; }
      if (existingLesson.clientId === partnerClientId) { showToast('Scegli un cliente diverso.', 'warn'); return; }

      const partnerPlan = getActivePlan(partnerClientId);
      const partnerPkg = getPackage(partnerPlan?.packageId);
      if (!partnerPlan || !partnerPkg) { showToast('Pacchetto mancante per il secondo cliente.', 'warn'); return; }

      // Genera un duoGroupId condiviso (o riusa quello esistente)
      const duoGroupId = existingLesson.duoGroupId || uid('duo');
      existingLesson.duoGroupId = duoGroupId;

      const ok = createLesson({
        clientId: partnerClientId,
        planId: partnerPlan.id,
        date: existingLesson.date,
        time: existingLesson.time,
        duration: existingLesson.duration,
        note: existingLesson.note || '',
        duoGroupId,
      });
      if (ok) {
        saveState(true);
        renderAfterLessonChange();
        openLessonModal(existingLessonId);
        showToast('Lezione DUO collegata.', 'ok');
      } else {
        // rollback duoGroupId se createLesson ha fallito
        existingLesson.duoGroupId = null;
      }
    }

    function unlinkDuoLesson(lessonId) {
      const lesson = getLesson(lessonId);
      if (!lesson?.duoGroupId) return;
      const partner = getDuoPartner(lesson);
      showConfirm('Scollega DUO', `Le due lezioni diventeranno indipendenti. I pacchetti non vengono modificati.`, () => {
        if (partner) partner.duoGroupId = null;
        lesson.duoGroupId = null;
        saveState(true);
        renderAfterLessonChange();
        openLessonModal(lesson.id);
        showToast('Lezioni scollegate.', 'ok');
      });
    }

    function rescheduleCancelledLesson({ date, time }) {
      const lesson = getLesson(state.selectedLessonId);
      if (!lesson) return;
      const wasCancelled = lesson.status === 'cancelled';
      if (!wasCancelled) {
        lesson.status = 'cancelled';
        saveState();
        requestGoogleLessonSync('upsert', lesson);
      }
      const ok = createLesson({
        clientId: lesson.clientId,
        planId: lesson.planId,
        date,
        time,
        duration: lesson.duration,
        note: `Recupero della lezione del ${formatDateShort(lesson.date)}`,
        linkedTo: lesson.id,
        setFixedTime: false
      });
      if (ok) openLessonModal(lesson.id);
    }

    function deleteLesson() {
      const lesson = getLesson(state.selectedLessonId);
      if (!lesson) return;
      const partner = getDuoPartner(lesson);
      const confirmMsg = partner
        ? `Questa è una lezione DUO: verranno eliminate sia la lezione di ${getClientFullName(getClient(lesson.clientId))} che quella di ${getClientFullName(getClient(partner.clientId))}. Questa azione non è reversibile.`
        : 'La lezione verrà rimossa definitivamente. Questa azione non è reversibile.';
      showConfirm('Elimina lezione', confirmMsg, () => {
        const deletedPayload = buildGoogleSyncPayload(lesson);
        state.lessons = state.lessons.filter(item => item.id !== lesson.id);
        if (partner) {
          const partnerPayload = buildGoogleSyncPayload(partner);
          state.lessons = state.lessons.filter(item => item.id !== partner.id);
          requestGoogleLessonSync('delete', partnerPayload);
        }
        saveState(true);
        renderAfterLessonChange();
        requestGoogleLessonSync('delete', deletedPayload);
        closeModal('lessonModalBackdrop');
        showToast(partner ? 'Lezione DUO eliminata.' : 'Lezione eliminata.', 'ok');
      });
    }

    function openRenewModal() {
      const client = getClient(state.selectedClientId);
      if (!client) { showToast('Seleziona un cliente.'); return; }
      const activePlan = getActivePlan(client.id);
      renderPackageOptions(el.renewPackage, activePlan?.packageId || state.packages[0]?.id || '');
      el.renewCheckMode.value = normalizeCheckMode(activePlan?.checkMode);
      const lastLesson = getLessonsForClient(client.id).filter(item => item.status !== 'cancelled').map(item => item.date).sort().slice(-1)[0];
      el.renewStartDate.value = lastLesson || todayISO();

      const oldPlanForPreview = getActivePlan(client.id);
      const oldStatsForPreview = oldPlanForPreview ? planStats(oldPlanForPreview) : { remaining: 0 };
      const carryPreview = Math.max(0, oldStatsForPreview.remaining || 0);

      const syncPrice = () => {
        const pkg = getPackage(el.renewPackage.value);
        const defaultPrice = Number(client.packagePrice || pkg?.totalPrice || 0);
        if (el.renewPrice && !el.renewPrice._touched) el.renewPrice.value = defaultPrice;
        const carryNote = carryPreview > 0 ? ` · +${carryPreview} lezioni riportate` : '';
        if (el.renewPriceHint) el.renewPriceHint.textContent = `Default: ${formatCurrency(defaultPrice)}${carryNote}`;
        el.renewPreview.innerHTML = buildPackageSummary(pkg, Number(el.renewPrice?.value || defaultPrice));
      };
      syncPrice();
      if (el.renewPrice) {
        el.renewPrice._touched = false;
        el.renewPrice.oninput = () => { el.renewPrice._touched = true; syncPrice(); };
      }
      el.renewPackage.onchange = () => { if (el.renewPrice) el.renewPrice._touched = false; syncPrice(); };
      openModal('renewModalBackdrop');
    }

    function renderReport() {
      const monthDate = state.viewDate;
      el.reportMonthLabel.textContent = formatMonthLabel(monthDate);
      const lessons = state.lessons.filter(item => sameMonth(fromISO(item.date), monthDate));
      const done = lessons.filter(item => item.status === 'done').length;
      const cancelled = lessons.filter(item => item.status === 'cancelled').length;
      const scheduled = lessons.filter(item => item.status === 'scheduled').length;
      const monthClients = state.clients.filter(client => sameMonth(new Date(client.createdAt || new Date()), monthDate));
      const freeClients = monthClients.filter(client => getClientServiceType(client) === 'free_session');
      const pack99Plans = state.plans.filter(plan => sameMonth(new Date(plan.createdAt || new Date()), monthDate) && isPack99Package(getPackage(plan.packageId)));
      const pack99ClientIds = new Set(pack99Plans.map(plan => plan.clientId));
      const pack99Clients = state.clients.filter(client => pack99ClientIds.has(client.id));
      const personalClients = monthClients.filter(client => getClientServiceType(client) !== 'free_session');
      const convertedClients = state.clients.filter(client => {
        const firstPersonalPlan = state.plans.find(plan => plan.clientId === client.id && (plan.planType || plan.type || 'personal') === 'personal');
        if (!firstPersonalPlan || !sameMonth(new Date(firstPersonalPlan.createdAt || new Date()), monthDate)) return false;
        const hadFree = (client.freeSessionDone === true) || !!state.lessons.find(lesson => lesson.clientId === client.id && (lesson.lessonType || lesson.type) === 'free_session');
        return hadFree;
      });
      const renewals = state.plans.filter(plan => plan.saleType === 'renewal' && sameMonth(new Date(plan.createdAt || new Date()), monthDate));
      const soldPlans = state.plans.filter(plan => sameMonth(new Date(plan.createdAt || new Date()), monthDate));
      const packageCounts = new Map();
      soldPlans.forEach(plan => {
        const pkg = getPackage(plan.packageId);
        const key = pkg?.name || 'Senza nome';
        packageCounts.set(key, (packageCounts.get(key) || 0) + 1);
      });
      const packageRows = [...packageCounts.entries()].sort((a, b) => b[1] - a[1]);

      const monthLessonsByType = { free_session: [], personal: [] };
      lessons.forEach(lesson => {
        const type = lesson.lessonType || lesson.type || 'personal';
        if (monthLessonsByType[type]) monthLessonsByType[type].push(lesson);
      });
      const monthPlansByType = { free_session: [], personal: [] };
      soldPlans.forEach(plan => {
        const type = (plan.planType || plan.type || 'personal');
        if (monthPlansByType[type]) monthPlansByType[type].push(plan);
      });

      const cancelCounts = new Map();
      lessons.filter(item => item.status === 'cancelled').forEach(lesson => {
        const client = getClient(lesson.clientId);
        const key = getClientFullName(client) || 'Cliente';
        cancelCounts.set(key, (cancelCounts.get(key) || 0) + 1);
      });
      const cancelRows = [...cancelCounts.entries()].sort((a, b) => b[1] - a[1]);
      const completionRate = done + cancelled ? Math.round((done / (done + cancelled)) * 100) : 0;
      const mood = completionRate >= 85 ? { title: 'Mese forte', text: `Completamento ${completionRate}%` } : completionRate >= 65 ? { title: 'Mese stabile', text: `Completamento ${completionRate}%` } : { title: 'Mese da rivedere', text: `Completamento ${completionRate}%` };
      const cancelRate = done + cancelled ? Math.round((cancelled / (done + cancelled)) * 100) : 0;
      const inactiveClients = getManagedClients().filter(client => {
        const lessonsForClient = getLessonsForClient(client.id).filter(item => item.status !== 'cancelled').sort((a, b) => a.date.localeCompare(b.date));
        const lastSeen = lessonsForClient.length ? fromISO(lessonsForClient[lessonsForClient.length - 1].date) : null;
        return !lastSeen || ((new Date() - lastSeen) / 86400000) > 30;
      });
      const soldPackages = soldPlans.map(plan => getPackage(plan.packageId)).filter(Boolean);
      const avgPackageLessons = soldPackages.length ? Math.round(soldPackages.reduce((sum, pkg) => sum + Number(pkg.lessonsTotal || 0), 0) / soldPackages.length) : 0;
      const monthClientIds = new Set(soldPlans.map(plan => plan.clientId));
      const monthPaymentClients = state.clients.filter(client => monthClientIds.has(client.id));
      const paidClients = monthPaymentClients.filter(client => client.paymentStatus === 'paid').length;
      const outstandingClients = monthPaymentClients.filter(client => client.paymentStatus !== 'paid').length;
      const activeInstallments = monthPaymentClients.filter(client => client.paymentMode === 'installments' && Number(client.installmentsPaid || 0) < Number(client.installmentsTotal || 1)).length;
      const totalMonthlyLessons = lessons.filter(item => item.status !== 'cancelled').length;
      const monthlyBalance = lessons
        .filter(item => item.status === 'done')
        .reduce((sum, lesson) => {
          const plan = getPlan(lesson.planId);
          const pkg = getPackage(plan?.packageId);
          return sum + getPlanUnitValue(plan, pkg, getClient(lesson.clientId), lesson);
        }, 0);

      const freeCompleted = monthLessonsByType.free_session.filter(item => item.status === 'done').length;
      const freeScheduled = monthLessonsByType.free_session.filter(item => item.status === 'scheduled').length;
      const freeCancelled = monthLessonsByType.free_session.filter(item => item.status === 'cancelled').length;
      const personalCompleted = monthLessonsByType.personal.filter(item => item.status === 'done').length;
      const personalScheduled = monthLessonsByType.personal.filter(item => item.status === 'scheduled').length;
      const personalCancelled = monthLessonsByType.personal.filter(item => item.status === 'cancelled').length;

      const previousSnapshot = getMonthSnapshot(addMonths(monthDate, -1));
      el.reportStats.innerHTML = [
        { label: 'Inseriti nel mese', value: monthClients.length, note: 'Tutti i clienti creati nel mese', ...getDeltaMeta(monthClients.length, previousSnapshot.newClients) },
        { label: 'Free session', value: freeClients.length, note: 'Lead entrati come prova', ...getDeltaMeta(freeClients.length, 0) },
        { label: 'Pack99', value: pack99Clients.length, note: 'Clienti con pack99 venduto nel mese', ...getDeltaMeta(pack99Clients.length, 0) },
        { label: 'Convertiti', value: convertedClients.length, note: 'Da free session a cliente', ...getDeltaMeta(convertedClients.length, 0) },
        { label: 'Rinnovi', value: renewals.length, note: 'Clienti riattivati', ...getDeltaMeta(renewals.length, 0) },
        { label: 'Totale lezioni', value: totalMonthlyLessons, note: 'Volume operativo del mese', ...getDeltaMeta(totalMonthlyLessons, previousSnapshot.total) },
        { label: 'Saldo mese', value: formatCurrency(monthlyBalance), note: 'Ricavo realizzato', ...getDeltaMeta(monthlyBalance, previousSnapshot.revenue) },
        { label: 'Tasso annulli', value: `${cancelRate}%`, note: 'Da mantenere basso', ...getDeltaMeta(cancelRate, previousSnapshot.done + previousSnapshot.cancelled ? Math.round((previousSnapshot.cancelled / (previousSnapshot.done + previousSnapshot.cancelled)) * 100) : 0, true) }
      ].map(item => `
        <div class="report-card">
          <div class="muted small">${item.label}</div>
          <div class="big">${item.value}</div>
          <div class="report-card-delta ${item.direction}">${item.text}</div>
          <div class="report-card-note">${item.note}</div>
        </div>
      `).join('');

      el.reportMoodTitle.textContent = 'Gestionale del mese';
      el.reportMoodText.textContent = `${mood.text} • Inseriti ${monthClients.length} • Conversioni ${convertedClients.length} • Saldo ${formatCurrency(monthlyBalance)}`;
      if (el.reportMoodTextPanel) {
        el.reportMoodTextPanel.innerHTML = [
          { label: 'Pagati', value: paidClients },
          { label: 'Da incassare', value: outstandingClients },
          { label: 'Rate aperte', value: activeInstallments },
          { label: 'Clienti inattivi', value: inactiveClients.length },
          { label: 'Pacchetto medio', value: avgPackageLessons ? `${avgPackageLessons} lez.` : '—' }
        ].map(item => `<div class="summary-row"><span>${escapeHtml(item.label)}</span><span class="tag">${escapeHtml(String(item.value))}</span></div>`).join('');
      }

      const renderClientRows = (clients, badgeLabel, badgeClass = '') => clients.length ? clients.map(client => {
        const activePlan = getActivePlan(client.id);
        const pkg = getPackage(activePlan?.packageId);
        return `<div class="management-card">
          <div class="management-card-head">
            <div>
              <div class="management-card-title">${escapeHtml(getClientFullName(client))}</div>
              <div class="management-card-meta">${escapeHtml(client.phone || client.email || 'Scheda cliente')} ${pkg ? `• ${escapeHtml(pkg.name || '')}` : ''}</div>
            </div>
            <span class="tag ${badgeClass}">${escapeHtml(badgeLabel)}</span>
          </div>
          <div class="inline-actions"><button class="btn btn-soft btn-small" data-report-client="${client.id}">Apri</button></div>
        </div>`;
      }).join('') : '<div class="muted">Nessun inserimento</div>';

      const renderTypeSection = (rows = []) => rows.length ? `
        <div class="summary-list">
          ${rows.map(row => `
            <div class="summary-row">
              <span>${escapeHtml(String(row.label || ''))}</span>
              <span class="tag ${escapeHtml(String(row.badgeClass || ''))}">${escapeHtml(String(row.value ?? '—'))}</span>
            </div>
          `).join('')}
        </div>
      ` : '<div class="muted">Nessun dato disponibile</div>';

      el.reportNewClients.innerHTML = renderClientRows(monthClients, 'nuovo');
      el.reportTopPackages.innerHTML = packageRows.length ? packageRows.slice(0, 8).map(([name, count]) => `<div class="summary-row"><span>${escapeHtml(name)}</span><span class="tag gold">${count}</span></div>`).join('') : '<div class="muted">Nessun movimento commerciale</div>';

      const freeBalance = monthLessonsByType.free_session.filter(item => item.status === 'done').reduce((sum, lesson) => {
        const plan = getPlan(lesson.planId);
        return sum + getPackageUnitValue(getPackage(plan?.packageId));
      }, 0);
      const personalBalance = monthLessonsByType.personal.filter(item => item.status === 'done').reduce((sum, lesson) => {
        const plan = getPlan(lesson.planId);
        return sum + getPackageUnitValue(getPackage(plan?.packageId));
      }, 0);

      el.reportFreeSession.innerHTML = renderClientRows(freeClients, 'free', 'blue') + renderTypeSection([
        { label: 'Svolte', value: freeCompleted },
        { label: 'Programmate', value: freeScheduled },
        { label: 'Annullate', value: freeCancelled },
        { label: 'Saldo mese', value: formatCurrency(freeBalance) }
      ]);
      el.reportPack99.innerHTML = renderClientRows(pack99Clients, 'pack99', 'gold') + renderTypeSection([
        { label: 'Pack99 venduti', value: pack99Plans.length },
        { label: 'Clienti coinvolti', value: pack99Clients.length },
        { label: 'Lezioni personal', value: personalCompleted },
        { label: 'Saldo personal', value: formatCurrency(personalBalance) }
      ]);
      el.reportPersonal.innerHTML = renderClientRows(personalClients, 'cliente', 'green') + renderTypeSection([
        { label: 'Percorsi venduti', value: monthPlansByType.personal.length },
        { label: 'Lezioni svolte', value: personalCompleted },
        { label: 'Programmate', value: personalScheduled },
        { label: 'Annullate', value: personalCancelled }
      ]);
      el.reportOutstanding.innerHTML = renderTypeSection(monthPaymentClients.filter(client => client.paymentStatus !== 'paid').map(client => ({
        label: `${getClientFullName(client)} · ${getPaymentStatusLabel(client.paymentStatus)}`,
        value: client.paymentMode === 'installments' ? `${Number(client.installmentsPaid || 0)}/${Number(client.installmentsTotal || 1)} rate` : 'da saldare'
      })));
      el.reportInstallments.innerHTML = renderTypeSection(monthPaymentClients.filter(client => client.paymentMode === 'installments' && Number(client.installmentsPaid || 0) < Number(client.installmentsTotal || 1)).map(client => ({
        label: getClientFullName(client),
        value: `${Number(client.installmentsPaid || 0)}/${Number(client.installmentsTotal || 1)}`
      })));
      applyReportFilter();
      el.reportCancelRanking.innerHTML = cancelRows.length ? cancelRows.slice(0, 8).map(([name, count]) => `<div class="summary-row"><span>${escapeHtml(name)}</span><span class="tag red">${count}</span></div>`).join('') : '<div class="muted">Nessun annullamento</div>';
      el.reportFollowups.innerHTML = convertedClients.length ? convertedClients.map(client => `<div class="summary-row"><span>${escapeHtml(getClientFullName(client))}</span><button class="btn btn-soft btn-small" data-report-client="${client.id}">Apri</button></div>`).join('') : '<div class="muted">Nessuna conversione da free session</div>';
      document.querySelectorAll('[data-report-client]').forEach(button => {
        button.addEventListener('click', () => {
          selectClient(button.getAttribute('data-report-client'));
          closeModal('reportModalBackdrop');
        });
      });
    }

    function toTitleCaseName(value) {
      return String(value || '')
        .trim()
        .toLowerCase()
        .replace(/(^|[\s'\-])([a-zà-ÿ])/g, (m, sep, ch) => sep + ch.toUpperCase());
    }

    function normalizePhoneDigits(phone) {
      return String(phone || '').replace(/\D/g, '');
    }

    function phoneComparableKey(phone) {
      let digits = normalizePhoneDigits(phone);
      if (digits.startsWith('0039')) digits = digits.slice(4);
      if (digits.startsWith('39') && digits.length > 10) digits = digits.slice(2);
      return digits;
    }

    function nameComparableKey(firstName, lastName) {
      return `${String(firstName || '').trim()} ${String(lastName || '').trim()}`
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, ' ')
        .trim();
    }

    function normalizeItalianPhone(phone) {
      let digits = normalizePhoneDigits(phone);
      if (digits.startsWith('00')) digits = digits.slice(2);
      if (!digits.startsWith('39')) digits = '39' + digits;
      return digits;
    }

    function parseFreeSessionContactsInput(raw) {
      const lines = String(raw || '').split(/\r?\n/).map(line => line.trim()).filter(Boolean);
      const existingPhones = new Set(state.clients.map(client => phoneComparableKey(client.phone)).filter(Boolean));
      const existingNames = new Set(state.clients.map(client => nameComparableKey(client.firstName || client.name, client.lastName)).filter(Boolean));
      const seenPhones = new Set();
      const seenNames = new Set();
      return lines.map((line, index) => {
        const phoneMatch = line.match(/(?:\+?39[\s.\-\/]*)?3\d[\d\s.\-\/]{6,}\d/);
        if (!phoneMatch) return { index, line, valid: false, duplicate: false, error: 'Telefono non trovato' };
        const rawPhone = phoneMatch[0];
        const phoneKey = phoneComparableKey(rawPhone);
        if (!phoneKey || phoneKey.length < 9) return { index, line, valid: false, duplicate: false, error: 'Telefono non valido' };

        const beforePhone = line.slice(0, phoneMatch.index).trim();
        let firstName = '';
        let lastName = '';
        const tabParts = line.split(/\t+/).map(part => part.trim()).filter(Boolean);

        if (tabParts.length >= 3 && normalizePhoneDigits(tabParts[2]).length >= 7) {
          lastName = tabParts[0];
          firstName = tabParts[1];
        } else if (tabParts.length >= 4 && normalizePhoneDigits(tabParts[3]).length >= 7) {
          lastName = tabParts[0];
          firstName = tabParts[1];
        } else {
          const nameTokens = beforePhone.split(/\s+/).filter(Boolean);
          if (nameTokens.length < 2) return { index, line, valid: false, duplicate: false, error: 'Nome/cognome incompleti' };
          const firstTwoUpper = nameTokens.slice(0, 2).every(token => token === token.toUpperCase());
          if (firstTwoUpper) {
            lastName = nameTokens[0];
            firstName = nameTokens[1];
          } else {
            firstName = nameTokens[0];
            lastName = nameTokens.slice(1).join(' ');
          }
        }

        firstName = toTitleCaseName(firstName);
        lastName = toTitleCaseName(lastName);
        const nameKey = nameComparableKey(firstName, lastName);
        const duplicatePhone = existingPhones.has(phoneKey) || seenPhones.has(phoneKey);
        const duplicateName = nameKey && (existingNames.has(nameKey) || seenNames.has(nameKey));
        const duplicate = duplicatePhone || duplicateName;
        seenPhones.add(phoneKey);
        if (nameKey) seenNames.add(nameKey);
        return {
          index,
          line,
          valid: Boolean(firstName && lastName && phoneKey.length >= 9),
          duplicate,
          firstName,
          lastName,
          name: `${firstName} ${lastName}`.trim(),
          phone: phoneKey,
          error: duplicatePhone ? 'Telefono già presente' : (duplicateName ? 'Nome già presente' : '')
        };
      });
    }

    function saveAutomaticImportBackup() {
      try {
        const payload = {
          exportedAt: new Date().toISOString(),
          reason: 'before_free_session_import',
          clients: state.clients,
          packages: state.packages,
          plans: state.plans,
          lessons: state.lessons
        };
        localStorage.setItem(SESSION_BACKUP_KEY, JSON.stringify(payload));
        localStorage.setItem(BACKUP_LATEST_KEY, JSON.stringify(payload));
      } catch (error) {
        console.warn('Backup automatico import non salvato:', error);
      }
    }

    function renderFreeSessionImportPreview() {
      const input = document.getElementById('freeSessionImportInput');
      const preview = document.getElementById('freeSessionImportPreview');
      const confirmBtn = document.getElementById('confirmFreeSessionImportBtn');
      if (!input || !preview || !confirmBtn) return;
      const parsed = parseFreeSessionContactsInput(input.value);
      const importable = parsed.filter(item => item.valid && !item.duplicate);
      confirmBtn.disabled = importable.length === 0;
      confirmBtn.textContent = importable.length ? `Importa ${importable.length} contatti` : 'Importa contatti';
      if (!parsed.length) {
        preview.innerHTML = '<div class="empty">Incolla i contatti per vedere l\'anteprima.</div>';
        return;
      }
      preview.innerHTML = parsed.map(item => {
        const statusClass = item.valid && !item.duplicate ? 'ok' : 'warn';
        const status = item.valid && !item.duplicate ? 'Importabile' : (item.error || 'Da controllare');
        const rowClass = item.valid && !item.duplicate ? '' : (item.duplicate ? 'duplicate' : 'invalid');
        const title = item.valid ? `${escapeHtml(item.firstName)} ${escapeHtml(item.lastName)}` : escapeHtml(item.line);
        const phone = item.phone ? escapeHtml(item.phone) : '—';
        return `
          <div class="free-session-preview-row ${rowClass}">
            <div class="free-session-preview-main">
              <strong>${title}</strong>
              <span>${phone}</span>
            </div>
            <span class="free-session-preview-status ${statusClass}">${escapeHtml(status)}</span>
          </div>
        `;
      }).join('');
    }

    function createFreeSessionClient(item) {
      return {
        id: uid('client'),
        firstName: item.firstName,
        lastName: item.lastName,
        name: `${item.firstName} ${item.lastName}`.trim(),
        email: '',
        phone: item.phone,
        notes: 'Importato da Free Session',
        shareToken: generateShareToken(),
        serviceType: 'free_session',
        freeSessionDone: false,
        packagePurchased: true,
        conversionStatus: 'path_started',
        commercialStatus: 'included_free_session',
        paymentStatus: 'paid',
        paymentMode: 'included',
        installmentsTotal: 1,
        installmentsPaid: 1,
        packagePrice: 0,
        scheduleMode: 'same',
        fixedTime: '',
        fixedDays: [],
        variableSchedule: [],
        sendCalendarInvite: false,
        source: 'free_session_import',
        createdAt: new Date().toISOString()
      };
    }

    function importFreeSessionContacts() {
      const input = document.getElementById('freeSessionImportInput');
      if (!input) return;
      const parsed = parseFreeSessionContactsInput(input.value);
      const importable = parsed.filter(item => item.valid && !item.duplicate);
      if (!importable.length) {
        showToast('Nessun contatto importabile.', 'warn');
        renderFreeSessionImportPreview();
        return;
      }
      saveAutomaticImportBackup();
      const freePackage = ensureSpecialPackage('free_session');
      const newClients = importable.map(createFreeSessionClient);
      const newPlans = newClients.map(client => {
        const plan = {
          id: uid('plan'),
          clientId: client.id,
          packageId: freePackage.id,
          startDate: todayISO(),
          checkMode: 'none',
          saleType: 'included',
          status: 'active',
          planType: 'free_session',
          paymentStatus: 'paid',
          paymentMode: 'included',
          totalPrice: 0,
          createdAt: new Date().toISOString()
        };
        client.activePlanId = plan.id;
        return plan;
      });
      state.clients.push(...newClients);
      state.plans.push(...newPlans);
      state.selectedClientId = newClients[0]?.id || state.selectedClientId;
      state.clientFilter = 'free_session';
      saveState(true);
      renderAll();
      closeModal('freeSessionImportModalBackdrop');
      showToast(`${newClients.length} free session importate con pacchetto incluso e saldato.`, 'ok');
    }

    function openFreeSessionImportModal() {
      const input = document.getElementById('freeSessionImportInput');
      if (input) input.value = '';
      renderFreeSessionImportPreview();
      openModal('freeSessionImportModalBackdrop');
      setTimeout(() => input?.focus(), 80);
    }

    function openWhatsAppForClient(client) {
      if (!client?.phone) {
        showToast('Numero di telefono mancante.', 'warn');
        return;
      }
      const phone = normalizeItalianPhone(client.phone);
      const message = `Ciao ${client.firstName || getClientFullName(client)}, sono Dejan di DSWORLD. Ti scrivo per organizzare la tua free session.`;
      const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    }

    function downloadClientVCard(client) {
      if (!client?.phone) {
        showToast('Numero di telefono mancante.', 'warn');
        return;
      }
      const firstName = client.firstName || '';
      const lastName = client.lastName || '';
      const fullName = getClientFullName(client) || `${firstName} ${lastName}`.trim() || 'Contatto DSWORLD';
      const phone = normalizeItalianPhone(client.phone);
      const vcard = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `N:${lastName};${firstName};;;`,
        `FN:${fullName}`,
        `TEL;TYPE=CELL:+${phone}`,
        'ORG:DSWORLD',
        'NOTE:Free session DSWORLD',
        'END:VCARD'
      ].join('\n');
      const safeName = `${firstName || 'contatto'}_${lastName || 'dsworld'}`.replace(/[^a-z0-9_-]+/gi, '_');
      const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
      fallbackDownload(blob, `${safeName}.vcf`);
    }

    function hydrateClientQuickActions(root) {
      if (!root) return;
      root.querySelectorAll('[data-client-id]').forEach(card => {
        if (card.querySelector('.client-quick-actions')) return;
        const client = getClient(card.getAttribute('data-client-id'));
        if (!client?.phone) return;
        const wrap = document.createElement('div');
        wrap.className = 'client-quick-actions';
        wrap.setAttribute('aria-label', 'Azioni rapide contatto');

        const wa = document.createElement('button');
        wa.className = 'client-quick-action whatsapp';
        wa.type = 'button';
        wa.textContent = 'WhatsApp';
        wa.addEventListener('click', event => {
          event.preventDefault();
          event.stopPropagation();
          openWhatsAppForClient(client);
        });

        const vcf = document.createElement('button');
        vcf.className = 'client-quick-action';
        vcf.type = 'button';
        vcf.textContent = 'Salva contatto';
        vcf.addEventListener('click', event => {
          event.preventDefault();
          event.stopPropagation();
          downloadClientVCard(client);
        });

        wrap.append(wa, vcf);
        card.appendChild(wrap);
      });
    }

    function exportBackup() {
      const payload = {
        exportedAt: new Date().toISOString(),
        clients: state.clients,
        packages: state.packages,
        plans: state.plans,
        lessons: state.lessons
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const filename = `dsworld-backup-${todayISO()}.json`;
      /* Web Share API con file — AirDrop, iCloud Drive, Mail… */
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [new File([blob], filename, { type: 'application/json' })] })) {
        const file = new File([blob], filename, { type: 'application/json' });
        navigator.share({ title: 'DSWORLD Backup', files: [file] })
          .then(() => showToast('Backup condiviso!', 'ok'))
          .catch(err => { if (err.name !== 'AbortError') fallbackDownload(blob, filename); });
        return;
      }
      fallbackDownload(blob, filename);
    }

    function fallbackDownload(blob, filename) {
      const url = URL.createObjectURL(blob);
      try {
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        showToast('Backup esportato.');
      } finally {
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
    }

    function importBackup(file) {
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = JSON.parse(String(reader.result || '{}'));
          if (!Array.isArray(parsed.clients)) throw new Error('invalid');
          if (parsed.packages && !Array.isArray(parsed.packages)) throw new Error('invalid');
          if (parsed.plans && !Array.isArray(parsed.plans)) throw new Error('invalid');
          if (parsed.lessons && !Array.isArray(parsed.lessons)) throw new Error('invalid');
          const sanitize = (arr) => (arr || []).map(item => {
            if (typeof item !== 'object' || item === null || Array.isArray(item)) return null;
            const clean = {};
            for (const [k, v] of Object.entries(item)) {
              if (typeof v === 'string') clean[k] = v.replace(/<script[\s>]/gi, '');
              else clean[k] = v;
            }
            return clean;
          }).filter(Boolean);
          state.clients = sanitize(parsed.clients);
          state.packages = sanitize(parsed.packages) || seedPackages();
          state.plans = sanitize(parsed.plans) || [];
          state.lessons = sanitize(parsed.lessons) || [];
          state.selectedClientId = getDefaultSelectedClientId();
          saveState();
          renderAll();
          showToast('Backup importato.', 'ok');
        } catch (error) {
          console.error(error);
          showToast('Backup non valido.', 'error');
        }
      };
      reader.readAsText(file);
    }

    function resetPackageForm() {
      state.selectedPackageId = null;
      el.packageId.value = '';
      el.packageName.value = '';
      el.packageLessons.value = 12;
      el.packageWeeks.value = 8;
      el.packagePerWeek.value = 2;
      el.packageDuration.value = 60;
      el.packagePrice.value = 0;
      renderPackages();
    }

    function setAuthTab(tab) {
      document.querySelectorAll('[data-auth-tab]').forEach(button => button.classList.toggle('active', button.getAttribute('data-auth-tab') === tab));
      el.loginPanel.classList.toggle('active', tab === 'login');
      el.signupPanel.classList.toggle('active', tab === 'signup');
      el.resetPanel.classList.toggle('active', tab === 'reset');
    }

    async function saveCloudConfigFromInputs() {
      const config = loadSupabaseConfig();
      persistSupabaseConfig(config);
      initSupabaseClient(config);
      populateCloudConfigInputs();
      updateAuthMessage('Cloud collegato. Ora accedi con email e password.');
      await ensureSupabaseReady();
    }

    async function signInWithPassword(email, password) {
      if (!cloud.client) {
        initSupabaseClient(loadSupabaseConfig());
        if (!cloud.client) {
          showToast('Cloud non disponibile.');
          return;
        }
      }
      const { error } = await cloud.client.auth.signInWithPassword({ email, password });
      if (error) {
        console.error(error);
        updateAuthMessage(error.message || 'Login non riuscito.');
        showToast('Login non riuscito.');
        return;
      }
      updateAuthMessage('Accesso eseguito.');
      showToast('Accesso eseguito.', 'ok');
    }

    async function signUpWithPassword(email, password) {
      if (!email || !password) { showToast('Inserisci email e password.'); return; }
      if (password.length < 8) { showToast('Password troppo corta (min 8 caratteri).'); return; }
      if (!cloud.client) {
        initSupabaseClient(loadSupabaseConfig());
        if (!cloud.client) {
          showToast('Cloud non disponibile.');
          return;
        }
      }
      const { error } = await cloud.client.auth.signUp({ email, password });
      if (error) {
        console.error(error);
        updateAuthMessage(error.message || 'Registrazione non riuscita.');
        showToast('Registrazione non riuscita.');
        return;
      }
      updateAuthMessage('Account creato. Controlla l\'email se la conferma è attiva.');
      showToast('Account creato.', 'ok');
      setAuthTab('login');
      el.authLoginEmail.value = email;
    }

    function getResetRedirectUrl() {
      return `${window.location.origin}${window.location.pathname}`;
    }

    async function sendPasswordReset(email) {
      if (!email) {
        updateAuthMessage("Inserisci l'email del tuo account.");
        showToast("Inserisci l'email.");
        return;
      }
      if (!cloud.client) {
        initSupabaseClient(loadSupabaseConfig());
        if (!cloud.client) {
          showToast('Cloud non disponibile.');
          return;
        }
      }
      const { error } = await cloud.client.auth.resetPasswordForEmail(email, {
        redirectTo: getResetRedirectUrl()
      });
      if (error) {
        console.error(error);
        updateAuthMessage(error.message || 'Invio reset non riuscito.');
        showToast('Reset non inviato.');
        return;
      }
      updateAuthMessage('Email di reset inviata. Apri il link ricevuto per scegliere la nuova password.');
      showToast('Email di reset inviata.');
      el.authResetEmail.value = email;
      el.authLoginEmail.value = email;
      setAuthTab('login');
    }

    function handlePasswordRecovery(session) {
      cloud.session = session || cloud.session || null;
      cloud.user = session?.user || cloud.user || null;
      updateUserBadge();
      openModal('passwordUpdateModalBackdrop');
      updateAuthMessage('Apri la finestra e imposta la nuova password.');
      showToast('Imposta la nuova password.');
    }

    async function updatePasswordFromRecovery(newPassword) {
      if (!newPassword || newPassword.length < 8) {
        showToast('Password troppo corta.');
        return;
      }
      if (!cloud.client) {
        initSupabaseClient(loadSupabaseConfig());
        if (!cloud.client) {
          showToast('Cloud non disponibile.');
          return;
        }
      }
      const { error } = await cloud.client.auth.updateUser({ password: newPassword });
      if (error) {
        console.error(error);
        updateAuthMessage(error.message || 'Aggiornamento password non riuscito.');
        showToast('Password non aggiornata.');
        return;
      }
      const cleanUrl = new URL(window.location.href);
      cleanUrl.hash = '';
      if (cleanUrl.searchParams.get('type') === 'recovery') cleanUrl.searchParams.delete('type');
      window.history.replaceState({}, document.title, cleanUrl.toString());
      closeModal('passwordUpdateModalBackdrop');
      el.passwordUpdateInput.value = '';
      updateAuthMessage('Password aggiornata. Ora puoi accedere normalmente.');
      showToast('Password aggiornata.', 'ok');
      setAuthTab('login');
    }

    function clearLocalAppDataOnLogout() {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(BACKUP_LATEST_KEY);
      localStorage.removeItem(BACKUP_HISTORY_KEY);
      localStorage.removeItem(SESSION_BACKUP_KEY);
    }

    async function logoutCloud() {
      if (!cloud.client) return;
      const { error } = await cloud.client.auth.signOut();
      if (error) {
        console.error(error);
        showToast('Uscita non riuscita.');
        return;
      }
      clearLocalAppDataOnLogout();
      showToast("Sei uscito dall'account. Dati locali rimossi da questo dispositivo.");
    }


function renderClientFormStickySummary() {
  const box = document.getElementById('clientFormStickySummary');
  if (!box) return;
  const pkg = getPackage(el.clientPackage?.value);
  const price = Number(el.clientPackagePrice?.value || pkg?.totalPrice || 0);
  /* Progress: count filled required-ish fields */
  const fields = [
    el.clientName?.value?.trim(),
    el.clientSurname?.value?.trim(),
    el.clientPackage?.value,
    el.clientStartDate?.value,
    el.clientFixedTime?.value,
  ];
  const filled = fields.filter(Boolean).length;
  const pct = Math.round((filled / fields.length) * 100);
  const pctColor = pct < 40 ? 'var(--bad)' : pct < 80 ? 'var(--warn)' : 'var(--good)';
  box.innerHTML = `
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
      <div style="flex:1;height:4px;border-radius:99px;background:rgba(255,255,255,0.08);overflow:hidden;">
        <div style="width:${pct}%;height:100%;border-radius:99px;background:${pctColor};transition:width 300ms ease;"></div>
      </div>
      <span style="font-size:0.78rem;color:var(--muted);flex-shrink:0;">${pct}%</span>
    </div>
    <div class="summary-row"><span>Pacchetto</span><strong>${escapeHtml(pkg?.name || 'Seleziona un pacchetto')}</strong></div>
    <div class="summary-row"><span>Valore</span><strong>${formatCurrency(price)}</strong></div>
    <div class="summary-row"><span>Formula</span><strong>${escapeHtml(pkg ? `${pkg.lessonsTotal} lezioni · ${pkg.perWeek}/sett. · ${pkg.duration} min` : '—')}</strong></div>
  `;
}


    function applyResponsiveDefaults() {
      if (!state.calendarView || !['month', 'week', 'day'].includes(state.calendarView)) {
        state.calendarView = 'month';
      }
      if (!state.selectedDay) {
        state.selectedDay = todayISO();
      }
    }

    /* ── Render mirati — eseguono solo le sezioni che cambiano ────
       Usare questi invece di renderAll() quando il cambiamento è circoscritto.
       renderAll() resta per init, import, CRUD cliente/pacchetto, logout. */

    function renderCalendarOnly() {
      renderCalendarHead();
      renderCalendar();
    }

    function renderAfterCalendarNavigation() {
      renderHero();
      renderHeroGreeting();
      renderAlerts();
      renderCalendarHead();
      renderCalendar();
    }

    function renderAfterLessonChange() {
      renderHero();
      renderHeroGreeting();
      renderSelectedClient();
      renderAlerts();
      renderClientList();
      renderCalendarHead();
      renderCalendar();
    }

    function renderAfterClientFocus() {
      renderSelectedClient();
      renderClientList();
    }

    function renderAfterPaymentChange() {
      renderHero();
      renderHeroGreeting();
      renderSelectedClient();
      renderAlerts();
      renderClientList();
    }

    let _rendering = false;
    function renderAll() {
      if (_rendering) return;
      _rendering = true;
      try {
        applyResponsiveDefaults();
        try { autoCompleteElapsedLessons(); } catch(e) { console.error(e); }
        renderHero();
        renderHeroGreeting();
        // opsBoard rimosso
        renderSelectedClient();
        renderAlerts();
        renderClientList();
        renderCalendarHead();
        renderCalendar();
        renderPackages();
        renderPackageOptions(el.clientPackage, el.clientPackage.value || state.packages[0]?.id || '');
        renderPackageOptions(el.renewPackage, el.renewPackage.value || state.packages[0]?.id || '');
        el.packagePreview.innerHTML = buildPackageSummary(getPackage(el.clientPackage.value));
        renderClientFormStickySummary();
        el.renewPreview.innerHTML = buildPackageSummary(getPackage(el.renewPackage.value));
        renderFixedSchedulePreview();
        if (el.reportModalBackdrop.classList.contains('open')) renderReport();
      } finally {
        _rendering = false;
      }
    }

    function openNewClientModal(trigger = document.activeElement) {
      requestAnimationFrame(() => renderClientModal(null, trigger));
    }

    document.getElementById('openClientBtn').addEventListener('click', event => openNewClientModal(event.currentTarget));
    document.getElementById('openPackagesBtn').addEventListener('click', () => { renderPackages(); openModal('packagesModalBackdrop'); });
    document.getElementById('openReportBtn').addEventListener('click', () => { renderReport(); openModal('reportModalBackdrop'); });
    el.exportManagedXlsxBtn.addEventListener('click', exportManagedXlsx);
    document.getElementById('prevMonthBtn').addEventListener('click', () => moveCalendar(-1));
    document.getElementById('nextMonthBtn').addEventListener('click', () => moveCalendar(1));
    document.getElementById('todayBtn').addEventListener('click', resetCalendarToToday);
    const handleResize = throttle(() => { applyResponsiveDefaults(); renderCalendarHead(); renderCalendar(); }, 140);
    window.addEventListener('resize', handleResize);
    document.getElementById('exportBtn').addEventListener('click', exportBackup);
    document.getElementById('importInput').addEventListener('change', event => importBackup(event.target.files?.[0]));
    document.getElementById('openFreeSessionImportBtn')?.addEventListener('click', openFreeSessionImportModal);
    document.getElementById('openFreeSessionImportDrawerBtn')?.addEventListener('click', () => {
      document.getElementById('sidebarDrawer')?.classList.remove('open');
      document.getElementById('drawerOverlay')?.classList.remove('open');
      unlockBodyScroll();
      openFreeSessionImportModal();
    });
    document.getElementById('freeSessionImportInput')?.addEventListener('input', renderFreeSessionImportPreview);
    document.getElementById('clearFreeSessionImportBtn')?.addEventListener('click', () => {
      const input = document.getElementById('freeSessionImportInput');
      if (input) input.value = '';
      renderFreeSessionImportPreview();
    });
    document.getElementById('confirmFreeSessionImportBtn')?.addEventListener('click', importFreeSessionContacts);
    document.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => {
      const id = button.getAttribute('data-close');
      if (id === 'messagesModalBackdrop') {
        document.querySelector('.messages-modal-body')?.classList.remove('show-chat');
        _activeMsgClientToken = null;
        _activeMsgClientId = null;
      }
      closeModal(id);
    }));
    document.querySelectorAll('.modal-backdrop').forEach(backdrop => backdrop.addEventListener('click', event => { if (event.target === backdrop) closeModal(backdrop.id); }));

    document.querySelectorAll('[data-auth-tab]').forEach(button => {
      button.addEventListener('click', () => setAuthTab(button.getAttribute('data-auth-tab')));
    });
    el.saveSupabaseConfigBtn.addEventListener('click', () => saveCloudConfigFromInputs());
    el.saveCloudConfigBtn.addEventListener('click', () => saveCloudConfigFromInputs());
    el.useDemoLocalBtn.addEventListener('click', () => {
      cloud.allowLocalOnly = true;
      updateUserBadge();
      updateSyncBadge('Solo cache locale');
      updateAuthMessage('Modalità locale attiva. Nessuna sincronizzazione cloud.');
      renderAll();
    });
    el.openAccountBtn.addEventListener('click', async () => { populateCloudConfigInputs(); await refreshGoogleStatus(); openModal('accountModalBackdrop'); });
    el.manualSyncBtn.addEventListener('click', async () => {
      const ok = await syncStateToCloud(true);
      if (ok) showToast('Sincronizzazione completata.');
    });
    el.connectGoogleBtn.addEventListener('click', startGoogleCalendarConnect);
    el.googleResyncBtn.addEventListener('click', () => syncAllLessonsToGoogle(true));
    el.disconnectGoogleBtn.addEventListener('click', disconnectGoogleCalendar);
    el.logoutBtnModal.addEventListener('click', logoutCloud);
    el.showResetTabBtn.addEventListener('click', () => {
      el.authResetEmail.value = el.authLoginEmail.value.trim();
      setAuthTab('reset');
    });
    el.sendResetPasswordBtn.addEventListener('click', () => {
      const email = cloud.user?.email || el.authLoginEmail.value.trim() || el.authResetEmail.value.trim();
      sendPasswordReset(email);
    });
    el.loginPanel.addEventListener('submit', event => {
      event.preventDefault();
      signInWithPassword(el.authLoginEmail.value.trim(), el.authLoginPassword.value);
    });
    el.signupPanel.addEventListener('submit', event => {
      event.preventDefault();
      signUpWithPassword(el.authSignupEmail.value.trim(), el.authSignupPassword.value);
    });
    el.resetPanel.addEventListener('submit', event => {
      event.preventDefault();
      sendPasswordReset(el.authResetEmail.value.trim());
    });
    el.passwordUpdateForm.addEventListener('submit', event => {
      event.preventDefault();
      updatePasswordFromRecovery(el.passwordUpdateInput.value);
    });

    el.clientSearch.addEventListener('input', event => { state.search = event.target.value; renderClientList(); });
    if (el.clientFilterRow) {
      el.clientFilterRow.querySelectorAll('[data-client-filter]').forEach(button => {
        button.addEventListener('click', () => {
          state.clientFilter = button.getAttribute('data-client-filter');
          /* sync aria-pressed state */
          el.clientFilterRow.querySelectorAll('[data-client-filter]').forEach(b => {
            const isActive = b.getAttribute('data-client-filter') === state.clientFilter;
            b.setAttribute('aria-pressed', isActive ? 'true' : 'false');
          });
          renderClientList();
        });
      });
    }
    if (el.calendarQuickSearch) {
      el.calendarQuickSearch.addEventListener('input', event => {
        state.calendarQuickSearch = event.target.value;
        renderCalendarQuickSearchResults();
      });
      el.calendarQuickSearch.addEventListener('focus', () => renderCalendarQuickSearchResults());
      el.calendarQuickSearch.addEventListener('blur', () => {
        setTimeout(() => {
          state.calendarQuickSearch = '';
          renderCalendarQuickSearchResults();
        }, 120);
      });
    }
    el.calendarViewButtons.forEach(button => button.addEventListener('click', () => setCalendarView(button.getAttribute('data-calendar-view'))));
    el.clientPackage.addEventListener('change', () => {
      const serviceType = el.clientServiceType?.value || 'personal';
      let pkg = getPackage(el.clientPackage.value);
      if (serviceType === 'free_session') pkg = ensureSpecialPackage('free_session');
      if (el.clientPackagePrice && pkg) el.clientPackagePrice.value = Number(pkg.totalPrice || 0);
      el.packagePreview.innerHTML = buildPackageSummary(pkg, Number(el.clientPackagePrice?.value || pkg?.totalPrice || 0));
      renderClientWeekdayPicker(getSelectedClientWeekdays().length ? getSelectedClientWeekdays() : [normalizeWeekday(fromISO(el.clientStartDate.value || todayISO()).getDay())], Math.max(1, Number(pkg?.perWeek || 1)));
      updateFixedScheduleUI();
      if (el.clientPackagePrice && pkg) el.clientPackagePrice.value = Number(pkg.totalPrice || 0);
      updateClientServiceUi();
      renderFixedSchedulePreview();
    });
    el.clientStartDate.addEventListener('change', () => {
      if (!getSelectedClientWeekdays().length) {
        const serviceType = el.clientServiceType?.value || 'personal';
      let pkg = getPackage(el.clientPackage.value);
      if (serviceType === 'free_session') pkg = ensureSpecialPackage('free_session');
        renderClientWeekdayPicker([normalizeWeekday(fromISO(el.clientStartDate.value || todayISO()).getDay())], Math.max(1, Number(pkg?.perWeek || 1)));
      }
      renderFixedSchedulePreview();
    });
    el.clientFixedTime.addEventListener('input', renderFixedSchedulePreview);
    if (el.clientPackagePrice) el.clientPackagePrice.addEventListener('input', () => {
      const pkg = getPackage(el.clientPackage?.value);
      if (el.packagePreview) el.packagePreview.innerHTML = buildPackageSummary(pkg, Number(el.clientPackagePrice?.value || pkg?.totalPrice || 0));
    });
    el.clientPaymentMode.addEventListener('change', updateInstallmentsUI);
    el.clientPaymentStatus.addEventListener('change', updateInstallmentsUI);
    // Aggiorna paymentStatus in tempo reale quando si cambiano le rate
    if (el.clientInstallmentsTotal) el.clientInstallmentsTotal.addEventListener('input', updateInstallmentsUI);
    if (el.clientInstallmentsPaid)  el.clientInstallmentsPaid.addEventListener('input', updateInstallmentsUI);
    document.querySelectorAll('input[name="scheduleMode"]').forEach(input => input.addEventListener('change', () => {
      updateFixedScheduleUI();
      renderFixedSchedulePreview();
    }));
    el.clientServiceType.addEventListener('change', () => { updateClientServiceUi(); updateFixedScheduleUI(); renderFixedSchedulePreview(); });
    el.clientFreeSessionDone.addEventListener('change', () => { updateClientServiceUi(); updateFixedScheduleUI(); renderFixedSchedulePreview(); });
    el.renewPackage.addEventListener('change', () => { el.renewPreview.innerHTML = buildPackageSummary(getPackage(el.renewPackage.value)); });
    el.reportFilterBar?.querySelectorAll('[data-report-filter]').forEach(button => button.addEventListener('click', () => { state.reportFilter = button.getAttribute('data-report-filter') || 'all'; applyReportFilter(); }));

    el.clientForm.addEventListener('submit', event => {
      event.preventDefault();
      const firstName = el.clientName.value.trim();
      const lastName = el.clientSurname.value.trim();
      const name = [firstName, lastName].filter(Boolean).join(' ').trim();
      if (!firstName || !lastName) { showToast('Inserisci nome e cognome.'); return; }
      const serviceType = el.clientServiceType.value || 'personal';
      const clientEmail = (el.clientEmail?.value || '').trim();
      const sendCalendarInvite = el.clientSendCalendarInvite?.value === 'yes';
      if (sendCalendarInvite && !clientEmail) { showToast('Inserisci l\'email del cliente per inviare il calendario.'); return; }
      const freeSessionDone = el.clientFreeSessionDone.value === 'yes';
      const packagePurchased = el.clientPackagePurchased.value === 'yes';
      const conversionStatus = el.clientConversionStatus.value || 'path_started';
      const paymentMode = serviceType === 'free_session' ? 'included' : (el.clientPaymentMode.value || 'single');
      const installmentsTotal = paymentMode === 'installments' ? Math.min(3, Math.max(2, Number(el.clientInstallmentsTotal.value || 2))) : 1;
      const installmentsPaid = paymentMode === 'installments' ? Math.max(0, Math.min(installmentsTotal, Number(el.clientInstallmentsPaid.value || 0))) : 1;
      // Se modalità rate: lo stato si deriva dalle rate (non dal select) — evita incoerenze
      const paymentStatusRaw = serviceType === 'free_session' ? 'paid' : (el.clientPaymentStatus.value || 'unpaid');
      const paymentStatus = paymentMode === 'installments'
        ? (installmentsPaid >= installmentsTotal ? 'paid' : installmentsPaid > 0 ? 'partial' : 'unpaid')
        : paymentStatusRaw;
      const normalizedPaymentStatus = serviceType === 'free_session' ? 'paid' : paymentStatus;
      const normalizedPaymentMode = serviceType === 'free_session' ? 'included' : paymentMode;
      const normalizedInstallmentsTotal = serviceType === 'free_session' ? 1 : installmentsTotal;
      const normalizedInstallmentsPaid = serviceType === 'free_session' ? 1 : installmentsPaid;
      let packageId = el.clientPackage.value;
      let pkg = getPackage(packageId);
      if (serviceType === 'free_session') {
        pkg = ensureSpecialPackage('free_session');
        packageId = pkg.id;
      }
      if (!pkg) { showToast('Crea prima un pacchetto.'); return; }
      const packageIsPack99 = isPack99Package(pkg);
      const scheduleMode = document.querySelector('input[name="scheduleMode"]:checked')?.value || 'same';
      const fixedTime = scheduleMode === 'same' ? el.clientFixedTime.value : '';
      const fixedDays = scheduleMode === 'same' ? getSelectedClientWeekdays() : [];
      const variableSchedule = scheduleMode === 'different' ? getVariableScheduleSelections() : [];
      const requiredDays = Math.max(1, Number(pkg.perWeek || 1));
      if (scheduleMode === 'same' && fixedTime && fixedDays.length !== requiredDays) {
        showToast(`Seleziona ${requiredDays} ${requiredDays === 1 ? 'giorno fisso' : 'giorni fissi'} per il piano rapido.`);
        return;
      }
      if (scheduleMode === 'different' && variableSchedule.length && variableSchedule.length !== requiredDays) {
        showToast(`Seleziona ${requiredDays} giorni con orari specifici per il piano rapido.`);
        return;
      }
      const currentId = el.clientId.value;
      if (currentId) {
        const client = getClient(currentId);
        const plan = getActivePlan(currentId);
        if (!client || !plan) return;
        client.firstName = firstName;
        client.lastName = lastName;
        client.name = name;
        client.email = clientEmail;
        client.sendCalendarInvite = sendCalendarInvite;
        client.notes = el.clientNotes.value.trim();
        client.serviceType = serviceType;
        client.freeSessionDone = freeSessionDone;
        client.packagePurchased = serviceType === 'free_session' ? true : packagePurchased;
        client.conversionStatus = conversionStatus;
        client.commercialStatus = serviceType === 'free_session' ? 'included_free_session' : (client.commercialStatus === 'included_free_session' ? '' : client.commercialStatus);
        client.paymentStatus = normalizedPaymentStatus;
        client.paymentMode = normalizedPaymentMode;
        client.installmentsTotal = normalizedInstallmentsTotal;
        client.installmentsPaid = normalizedInstallmentsPaid;
        client.packagePrice = serviceType === 'free_session' ? 0 : Number(el.clientPackagePrice?.value || pkg?.totalPrice || 0);
        client.scheduleMode = scheduleMode;
        client.fixedTime = scheduleMode === 'same' ? fixedTime : '';
        client.fixedDays = scheduleMode === 'same' ? fixedDays : [];
        client.variableSchedule = scheduleMode === 'different' ? variableSchedule : [];
        ensureClientHistoryBuckets(client);
        pushClientPaymentSnapshot(client, 'update');
        plan.packageId = packageId;
        plan.startDate = el.clientStartDate.value;
        plan.checkMode = el.clientCheckMode.value;
        plan.totalPrice = serviceType === 'free_session' ? 0 : Number(el.clientPackagePrice?.value || pkg?.totalPrice || 0);
        plan.planType = serviceType;
        plan.paymentStatus = normalizedPaymentStatus;
        plan.paymentMode = normalizedPaymentMode;
        state.lessons = state.lessons.map(lesson => lesson.planId === plan.id ? { ...lesson, duration: pkg.duration, lessonType: lesson.lessonType || serviceType } : lesson);
        saveState(true);
        renderAll();
        closeModal('clientModalBackdrop');
        showToast('Cliente aggiornato.');
        return;
      }
      const clientId = uid('client');
      const planId = uid('plan');
      const clientPayload = {
        id: clientId,
        firstName,
        lastName,
        name,
        email: clientEmail,
        sendCalendarInvite,
        notes: el.clientNotes.value.trim(),
        shareToken: generateShareToken(),
        serviceType,
        freeSessionDone,
        packagePurchased: serviceType === 'free_session' ? true : packagePurchased,
        conversionStatus,
        commercialStatus: serviceType === 'free_session' ? 'included_free_session' : '',
        paymentStatus: normalizedPaymentStatus,
        paymentMode: normalizedPaymentMode,
        installmentsTotal: normalizedInstallmentsTotal,
        installmentsPaid: normalizedInstallmentsPaid,
        packagePrice: serviceType === 'free_session' ? 0 : Number(el.clientPackagePrice?.value || pkg?.totalPrice || 0),
        scheduleMode,
        fixedTime: scheduleMode === 'same' ? fixedTime : '',
        fixedDays: scheduleMode === 'same' ? fixedDays : [],
        variableSchedule: scheduleMode === 'different' ? variableSchedule : [],
        activePlanId: planId,
        createdAt: new Date().toISOString()
      };
      const planPayload = {
        id: planId,
        clientId,
        packageId,
        startDate: el.clientStartDate.value,
        checkMode: el.clientCheckMode.value,
        saleType: 'new',
        totalPrice: serviceType === 'free_session' ? 0 : Number(el.clientPackagePrice?.value || pkg?.totalPrice || 0),
        planType: serviceType,
        status: 'active',
        paymentStatus: normalizedPaymentStatus,
        paymentMode: normalizedPaymentMode,
        createdAt: new Date().toISOString()
      };
      state.clients.unshift(clientPayload);
      state.plans.push(planPayload);
      state.selectedClientId = clientId;
      saveState(true);
      let plannedCount = 0;
      if (scheduleMode === 'same' && fixedTime && fixedDays.length) {
        plannedCount = createRecurringLessonsForClient({
          client: clientPayload,
          plan: planPayload,
          pkg,
          startDate: planPayload.startDate,
          weekdays: fixedDays,
          time: fixedTime,
          firstLessonType: packageIsPack99 && !freeSessionDone ? 'free_session' : serviceType,
          standardLessonType: 'personal'
        });
      } else if (scheduleMode === 'different' && variableSchedule.length) {
        plannedCount = createRecurringLessonsForClient({
          client: clientPayload,
          plan: planPayload,
          pkg,
          startDate: planPayload.startDate,
          weekdays: variableSchedule.map(item => item.weekday),
          timesByWeekday: Object.fromEntries(variableSchedule.map(item => [item.weekday, item.time])),
          firstLessonType: packageIsPack99 && !freeSessionDone ? 'free_session' : serviceType,
          standardLessonType: 'personal'
        });
      } else {
        renderAll();
      }
      closeModal('clientModalBackdrop');
      showToast(plannedCount ? `Cliente creato. ${plannedCount} lezioni già fissate.` : 'Cliente creato.');
    });

    el.deleteClientBtn.addEventListener('click', () => {
      const clientId = el.clientId.value;
      const client = getClient(clientId);
      if (!client) return;
      showConfirm(`Elimina ${getClientFullName(client)}`, `Verranno eliminati il cliente, tutte le sue lezioni e il piano attivo. Questa azione non è reversibile.`, () => {
        const lessonsToDelete = state.lessons.filter(item => item.clientId === clientId).map(item => buildGoogleSyncPayload(item));
        state.clients = state.clients.filter(item => item.id !== clientId);
        state.plans = state.plans.filter(item => item.clientId !== clientId);
        state.lessons = state.lessons.filter(item => item.clientId !== clientId);
        state.selectedClientId = getDefaultSelectedClientId();
        saveState(true);
        renderAll();
        lessonsToDelete.forEach(item => requestGoogleLessonSync('delete', item));
        closeModal('clientModalBackdrop');
        showToast('Cliente eliminato.', 'ok');
      });
    });

    el.packageForm.addEventListener('submit', event => {
      event.preventDefault();
      const payload = {
        id: el.packageId.value || uid('pkg'),
        name: el.packageName.value.trim(),
        lessonsTotal: Number(el.packageLessons.value || 0),
        weeks: Number(el.packageWeeks.value || 0),
        perWeek: Number(el.packagePerWeek.value || 0),
        duration: Number(el.packageDuration.value || 0),
        totalPrice: Number(el.packagePrice.value || 0),
        createdAt: new Date().toISOString()
      };
      if (!payload.name || !payload.lessonsTotal || !payload.weeks || !payload.perWeek || !payload.duration || payload.totalPrice < 0) {
        showToast('Completa il pacchetto.');
        return;
      }
      const idx = state.packages.findIndex(item => item.id === payload.id);
      if (idx >= 0) {
        const createdAt = state.packages[idx].createdAt;
        state.packages[idx] = { ...payload, createdAt };
      } else {
        state.packages.unshift(payload);
      }
      state.selectedPackageId = payload.id;
      saveState();
      renderAll();
      showToast('Pacchetto salvato.', 'ok');
    });

    document.getElementById('resetPackageBtn').addEventListener('click', resetPackageForm);

    el.deletePackageBtn.addEventListener('click', () => {
      const id = el.packageId.value;
      if (!id) return;
      const used = state.plans.some(plan => plan.packageId === id);
      if (used) {
        showToast('Pacchetto già usato da un cliente.', 'warn');
        return;
      }
      showConfirm('Elimina pacchetto', 'Il pacchetto verrà rimosso definitivamente.', () => {
        state.packages = state.packages.filter(item => item.id !== id);
        saveState(true);
        resetPackageForm();
        renderAll();
        showToast('Pacchetto eliminato.', 'ok');
      });
    });

    el.dayAddLessonBtn.addEventListener('click', () => {
      if (!state.selectedDay) return;
      const firstFree = el.daySlotGrid.querySelector('[data-slot-time]');
      if (firstFree) firstFree.scrollIntoView({ block: 'center', behavior: 'smooth' });
    });

    document.getElementById('confirmTimeBtn').addEventListener('click', () => {
      if (!state.pendingAdd) return;
      const time = el.timeManualInput.value || state.pendingTimeValue;
      if (!time) { showToast('Seleziona un orario.'); return; }
      const ok = createLesson({
        clientId: state.pendingAdd.clientId,
        planId: state.pendingAdd.planId,
        date: state.pendingAdd.date,
        time,
        duration: state.pendingAdd.duration,
        setFixedTime: state.pendingAdd.shouldFix
      });
      if (ok) {
        state.pendingAdd = null;
        state.pendingTimeValue = '';
        closeModal('timeModalBackdrop');
      }
    });

    document.getElementById('statusScheduledBtn').addEventListener('click', () => applyLessonStatus('scheduled'));
    document.getElementById('statusDoneBtn').addEventListener('click', () => applyLessonStatus('done'));
    document.getElementById('statusCancelledBtn').addEventListener('click', () => applyLessonStatus('cancelled'));
    document.getElementById('saveLessonBtn').addEventListener('click', saveLessonDetails);
    document.getElementById('quickRecoverBtn').addEventListener('click', () => {
      const lesson = getLesson(state.selectedLessonId);
      if (!lesson) return;
      lesson.status = 'cancelled';
      saveState();
      renderAfterLessonChange();
      requestGoogleLessonSync('upsert', lesson);
      openLessonModal(lesson.id);
      showToast('Lezione segnata come annullata.');
    });
    document.getElementById('deleteLessonBtn').addEventListener('click', deleteLesson);

    el.renewForm.addEventListener('submit', event => {
      event.preventDefault();
      const client = getClient(state.selectedClientId);
      const pkg = getPackage(el.renewPackage.value);
      if (!client || !pkg) return;

      // Calcola le lezioni rimanenti dal piano attuale da riportare
      const oldPlan = getActivePlan(client.id);
      const oldStats = oldPlan ? planStats(oldPlan) : { remaining: 0 };
      const carryOver = Math.max(0, oldStats.remaining || 0);

      const newPlanId = uid('plan');
      state.plans.push({
        id: newPlanId,
        clientId: client.id,
        packageId: pkg.id,
        startDate: el.renewStartDate.value,
        checkMode: el.renewCheckMode.value,
        saleType: 'renewal',
        planType: 'personal',
        totalPrice: Number(el.renewPrice?.value ?? client.packagePrice ?? pkg.totalPrice ?? 0),
        carryOverLessons: carryOver,   // lezioni riportate dal pacchetto precedente
        createdAt: new Date().toISOString()
      });

      // Resetta sempre il pagamento per il nuovo pacchetto
      client.paymentStatus = 'unpaid';
      if (!client.paymentMode) client.paymentMode = 'single';

      if (getClientServiceType(client) === 'free_session') {
        client.serviceType = 'personal';
        client.packagePurchased = true;
        client.conversionStatus = 'path_started';
      }

      // Dismetti gli alert vecchi di rinnovo e pagamento per questo cliente
      if (!Array.isArray(state.dismissedAlerts)) state.dismissedAlerts = [];
      ['renewal', 'payment'].forEach(type => {
        // Rimuovi qualsiasi alert precedente di questo tipo per il cliente
        state.dismissedAlerts = state.dismissedAlerts.filter(id => !id.startsWith(`${type}_${client.id}_`));
      });

      ensureClientHistoryBuckets(client);
      client.renewalHistory.push({
        id: uid('renewhist'),
        createdAt: new Date().toISOString(),
        packageId: pkg.id,
        packageName: pkg.name,
        startDate: el.renewStartDate.value,
        carryOverLessons: carryOver
      });
      client.activePlanId = newPlanId;
      saveState(true);
      renderAll();
      closeModal('renewModalBackdrop');
      const carryMsg = carryOver > 0 ? ` (+ ${carryOver} lezioni riportate)` : '';
      showToast(`Rinnovo registrato${carryMsg}.`, 'ok');
    });

    // "Chiudi senza rinnovo": rimuove gli alert di pagamento/rinnovo senza creare un nuovo piano
    document.getElementById('closeWithoutRenewBtn')?.addEventListener('click', () => {
      const client = getClient(state.selectedClientId);
      if (!client) return;
      showConfirm(
        'Chiudi senza rinnovo',
        `Verranno rimossi gli avvisi di pagamento e rinnovo per ${getClientFullName(client)}. Il pacchetto attuale resta invariato.`,
        () => {
          // Segna il pagamento come risolto
          client.paymentStatus = 'paid';
          // Rimuovi alert precedenti di questo cliente
          if (!Array.isArray(state.dismissedAlerts)) state.dismissedAlerts = [];
          state.dismissedAlerts = state.dismissedAlerts.filter(id =>
            !id.startsWith(`payment_${client.id}_`) && !id.startsWith(`renewal_${client.id}_`)
          );
          saveState(true);
          renderAll();
          closeModal('renewModalBackdrop');
          showToast('Pacchetto chiuso — avvisi rimossi.', 'ok');
        }
      );
    });

    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) return;
      try { saveLocalState(); } catch (error) { console.error(error); }
      if (cloud.client && cloud.user && !cloud.allowLocalOnly) {
        syncStateToCloud(true).catch(error => console.error(error));
      }
    });
    window.addEventListener('beforeunload', () => {
      try { saveLocalState(); } catch (error) { console.error(error); }
    });

    /* ═══════════════════════════════════════════════════════════
       HERO GREETING & TODAY STRIP
    ═══════════════════════════════════════════════════════════ */
    function renderHeroGreeting() {
      const dateLabel = document.getElementById('heroDateLabel');
      const greeting  = document.getElementById('heroGreeting');
      const strip     = document.getElementById('todayLessonsStrip');
      const stripItems = document.getElementById('todayStripItems');

      if (!dateLabel || !greeting) return;

      /* Date label */
      const now = new Date();
      const dayStr = now.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
      dateLabel.textContent = dayStr.charAt(0).toUpperCase() + dayStr.slice(1);

      /* Greeting by time of day */
      const hour = now.getHours();
      const saluto = hour < 12 ? 'Buongiorno' : hour < 18 ? 'Buon pomeriggio' : 'Buonasera';
      const todayBreakdown = getTodayLessonBreakdown(todayISO());
      const todayCount = todayBreakdown.personal + todayBreakdown.free;
      const alerts = getAlerts();
      const expiringCount = alerts.filter(a => a.type === 'renewal').length;

      const parts = [];
      if (todayBreakdown.personal > 0) parts.push(`${todayBreakdown.personal} ${todayBreakdown.personal === 1 ? 'lezione' : 'lezioni'}`);
      if (todayBreakdown.free > 0) parts.push(`${todayBreakdown.free} free`);
      if (expiringCount > 0) parts.push(`${expiringCount} ${expiringCount === 1 ? 'rinnovo in scadenza' : 'rinnovi in scadenza'}`);

      let subText = '';
      if (parts.length) subText = parts.join(' · ');
      else subText = 'Nessuna lezione oggi';

      greeting.textContent = saluto + '!';

      /* Update subtitle */
      const heroSub = document.getElementById('heroSubtitle');
      if (heroSub) heroSub.textContent = subText;

      /* Today's lessons strip */
      if (!strip || !stripItems) return;
      const todayLessons = state.lessons
        .filter(l => l.date === todayISO())
        .sort((a, b) => (a.time || '').localeCompare(b.time || ''));

      if (todayLessons.length === 0) {
        strip.hidden = true;
        return;
      }
      strip.hidden = false;
      stripItems.innerHTML = todayLessons.map(lesson => {
        const client = getClient(lesson.clientId);
        const name   = client ? getClientFullName(client).split(' ')[0] : 'Cliente';
        return `<button class="today-lesson-chip status-${lesson.status}" data-lesson-id="${lesson.id}" type="button" aria-label="${escapeHtml(getClientFullName(client))} alle ${lesson.time}">
          <span class="chip-time">${escapeHtml(lesson.time || '--:--')}</span>
          <span class="chip-name">${escapeHtml(name)}</span>
        </button>`;
      }).join('');
      stripItems.querySelectorAll('[data-lesson-id]').forEach(btn => {
        btn.addEventListener('click', () => openLessonModal(btn.getAttribute('data-lesson-id')));
      });
    }

    /* ═══════════════════════════════════════════════════════════
       PWA INSTALL BANNER
    ═══════════════════════════════════════════════════════════ */
    let _pwaInstallPrompt = null;
    function initPWAInstallBanner() {
      const banner      = document.getElementById('pwaInstallBanner');
      const installBtn  = document.getElementById('pwaInstallBtn');
      const dismissBtn  = document.getElementById('pwaInstallDismissBtn');
      if (!banner) return;

      /* Already dismissed this session */
      if (sessionStorage.getItem('pwa_banner_dismissed')) return;
      /* Already installed as standalone */
      if (window.matchMedia('(display-mode: standalone)').matches) return;

      window.addEventListener('beforeinstallprompt', e => {
        e.preventDefault();
        _pwaInstallPrompt = e;
        banner.classList.add('show');
      });

      if (installBtn) {
        installBtn.addEventListener('click', async () => {
          if (!_pwaInstallPrompt) return;
          _pwaInstallPrompt.prompt();
          const { outcome } = await _pwaInstallPrompt.userChoice;
          if (outcome === 'accepted') showToast('DSWORLD installato!', 'ok');
          _pwaInstallPrompt = null;
          banner.classList.remove('show');
        });
      }
      if (dismissBtn) {
        dismissBtn.addEventListener('click', () => {
          banner.classList.remove('show');
          sessionStorage.setItem('pwa_banner_dismissed', '1');
        });
      }
    }

    function throttle(fn, delay) {
      let last = 0;
      let timer = null;
      return (...args) => {
        const now = Date.now();
        const remaining = delay - (now - last);
        if (remaining <= 0) {
          clearTimeout(timer);
          timer = null;
          last = now;
          fn(...args);
          return;
        }
        clearTimeout(timer);
        timer = setTimeout(() => {
          last = Date.now();
          fn(...args);
        }, remaining);
      };
    }

    function bindClientListDelegation(root, { closeDrawerOnSelect = false } = {}) {
      if (!root || root.dataset.bound === 'true') return;
      root.dataset.bound = 'true';
      const activate = target => {
        const card = target.closest('[data-client-id]');
        if (!card || !root.contains(card)) return;
        selectClient(card.getAttribute('data-client-id'));
        if (closeDrawerOnSelect) {
          document.getElementById('sidebarDrawer')?.classList.remove('open');
          document.getElementById('drawerOverlay')?.classList.remove('open');
          unlockBodyScroll();
        }
      };
      root.addEventListener('click', event => activate(event.target));
      root.addEventListener('keydown', event => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        const card = event.target.closest('[data-client-id]');
        if (!card || !root.contains(card)) return;
        event.preventDefault();
        activate(card);
      });
    }

    function initInteractionDelegation() {
      bindClientListDelegation(el.clientList);
      bindClientListDelegation(document.getElementById('clientListDrawer'), { closeDrawerOnSelect: true });

      /* ── Hero insights delegation — una volta sola, nessun listener leak ── */
      function handleHeroKey(e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.target.closest('[data-hero-action]')?.click(); } }
      el.heroInsights.addEventListener('click', e => {
        const el_btn = e.target.closest('[data-hero-action]');
        if (!el_btn) return;
        const action = el_btn.getAttribute('data-hero-action');
        if (action === 'at-risk') openModal('atRiskModalBackdrop');
        if (action === 'prossima') {
          const date = el_btn.getAttribute('data-lesson-date');
          if (date) {
            state.selectedDay = date;
            state.viewDate = startOfMonth(fromISO(date));
            state.calendarView = 'day';
            saveState(); renderAfterCalendarNavigation();
          }
        }
      });
      el.heroInsights.addEventListener('keydown', handleHeroKey);

      el.heroStats.addEventListener('click', e => {
        const el_btn = e.target.closest('[data-hero-action]');
        if (!el_btn) return;
        if (el_btn.getAttribute('data-hero-action') === 'operazioni') openModal('operazioniModalBackdrop');
      });
      el.heroStats.addEventListener('keydown', handleHeroKey);

      /* ── Alert strip delegation ── */
      el.alertStrip.addEventListener('click', e => {
        const toggle = e.target.closest('[data-toggle-alerts]');
        if (toggle) { state.heroAlertsExpanded = !state.heroAlertsExpanded; renderAlerts(); return; }
        const chip = e.target.closest('[data-alert-client]');
        if (chip) selectClient(chip.getAttribute('data-alert-client'));
      });

      if (el.calendarQuickSearchResults && el.calendarQuickSearchResults.dataset.bound !== 'true') {
        el.calendarQuickSearchResults.dataset.bound = 'true';
        el.calendarQuickSearchResults.addEventListener('click', event => {
          const button = event.target.closest('[data-quick-client]');
          if (!button) return;
          const clientId = button.getAttribute('data-quick-client');
          selectClient(clientId);
          const client = getClient(clientId);
          el.calendarQuickSearch.value = client ? getClientFullName(client) : '';
          state.calendarQuickSearch = '';
          renderCalendarQuickSearchResults();
        });
      }

      if (el.calendarGrid && el.calendarGrid.dataset.bound !== 'true') {
        el.calendarGrid.dataset.bound = 'true';
        el.calendarGrid.addEventListener('click', event => {
          const lessonBtn = event.target.closest('.lesson-pill');
          if (lessonBtn) {
            event.stopPropagation();
            openLessonModal(lessonBtn.getAttribute('data-lesson-id'));
            return;
          }
          const addBtn = event.target.closest('.day-add');
          if (addBtn) {
            event.stopPropagation();
            const iso = addBtn.getAttribute('data-add-date');
            state.selectedDay = iso;
            if (window.innerWidth <= 580) {
              state.calendarView = 'day';
              saveState();
              renderAfterCalendarNavigation();
            } else {
              openDayModal(iso);
            }
            return;
          }
          const cell = event.target.closest('.day-cell');
          if (!cell) return;
          const iso = cell.getAttribute('data-date');
          state.selectedDay = iso;
          if (window.innerWidth <= 580) {
            state.calendarView = 'day';
            saveState();
            renderAfterCalendarNavigation();
          } else {
            openDayModal(iso);
          }
        });
      }

      if (el.agendaWrap && el.agendaWrap.dataset.bound !== 'true') {
        el.agendaWrap.dataset.bound = 'true';
        el.agendaWrap.addEventListener('click', event => {
          const slotTime = event.target.closest('[data-slot-time]');
          if (slotTime) {
            addLessonFromDaySlot(state.selectedDay || todayISO(), slotTime.getAttribute('data-slot-time'));
            return;
          }
          const slotLesson = event.target.closest('[data-slot-lesson-id]');
          if (slotLesson) {
            openLessonModal(slotLesson.getAttribute('data-slot-lesson-id'));
            return;
          }
          const lesson = event.target.closest('[data-lesson-id]');
          if (lesson) openLessonModal(lesson.getAttribute('data-lesson-id'));
        });
      }
    }

    /* ═══════════════════════════════════════════════════════════
       DEBOUNCED CLIENT SEARCH
    ═══════════════════════════════════════════════════════════ */
    function debounce(fn, delay) {
      let t;
      return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
    }

    /* Patch client search inputs to use debounce */
    function initDebouncedSearch() {
      const searchIds = ['clientSearch', 'clientSearchDrawer'];
      const debouncedUpdate = debounce(value => {
        state.search = value;
        renderClientList();
      }, 160);
      searchIds.forEach(id => {
        const input = document.getElementById(id);
        if (!input || input.dataset.debounced === 'true') return;
        input.dataset.debounced = 'true';
        input.addEventListener('input', e => {
          const value = e.target.value;
          searchIds.forEach(otherId => {
            if (otherId === id) return;
            const other = document.getElementById(otherId);
            if (other && other.value !== value) other.value = value;
          });
          debouncedUpdate(value);
        });
      });
    }

    /* ═══════════════════════════════════════════════════════════
       FREE SESSION → CONVERSIONE PERCORSO
       Si apre: (a) quando si clicca "Svolta" su lezione free,
                (b) auto-complete timer,
                (c) clic sul cliente con lezione done non convertita
    ═══════════════════════════════════════════════════════════ */
    function openFreeSessionConversionModal(client) {
      const backdrop = document.getElementById('fscBackdrop');
      if (!backdrop) return;

      const subtitleEl  = document.getElementById('fscSubtitle');
      const purchaseSec = document.getElementById('fscPurchaseSection');
      const previewEl   = document.getElementById('fscPreview');

      subtitleEl.textContent = `${getClientFullName(client)} ha completato la free session. Ha deciso di iniziare un percorso?`;

      /* Pacchetti disponibili: includi PACK 99, escludi FREE SESSION puro */
      const packages = state.packages.filter(p => p.name.toUpperCase() !== 'FREE SESSION');

      /* Se non ci sono pacchetti, vai direttamente a modifica cliente */
      if (!packages.length) {
        backdrop.classList.remove('open');
        unlockBodyScroll();
        renderClientModal(client);
        openModal('clientModalBackdrop');
        showToast('Aggiungi prima un pacchetto.', 'warn');
        return;
      }

      /* Popola il select con fresh clone per rimuovere listener precedenti */
      const oldSel = document.getElementById('fscPackageSelect');
      const newSel = oldSel.cloneNode(false); // cloneNode(false) = solo elemento, senza figli
      oldSel.parentNode.replaceChild(newSel, oldSel);
      newSel.innerHTML = packages.map(p =>
        `<option value="${p.id}">${escapeHtml(p.name)} — ${formatCurrency(p.totalPrice)}</option>`
      ).join('');

      const oldPrice = document.getElementById('fscPriceInput');
      const newPrice = oldPrice.cloneNode(false);
      oldPrice.parentNode.replaceChild(newPrice, oldPrice);
      newPrice.value = '';

      /* Funzione di aggiornamento preview */
      function refreshPreview() {
        const pkg = getPackage(newSel.value);
        if (!pkg) { previewEl.innerHTML = ''; return; }
        if (!newPrice.value) newPrice.value = pkg.totalPrice > 0 ? pkg.totalPrice : '';
        previewEl.innerHTML = buildPackageSummary(pkg, Number(newPrice.value) || pkg.totalPrice);
      }

      /* Mostra/nascondi sezione acquisto in base alla scelta iniziale */
      purchaseSec.style.display = 'grid';
      newSel.addEventListener('change', () => { newPrice.value = ''; refreshPreview(); });
      newPrice.addEventListener('input', refreshPreview);

      /* Trigger iniziale */
      const firstPkg = packages[0];
      if (firstPkg) {
        newPrice.value = firstPkg.totalPrice > 0 ? firstPkg.totalPrice : '';
        previewEl.innerHTML = buildPackageSummary(firstPkg, Number(newPrice.value) || 0);
      }

      /* Clone bottoni per rimuovere listener stantii */
      ['fscNoBtn','fscSkipBtn','fscYesBtn'].forEach(id => {
        const el2   = document.getElementById(id);
        const clone = el2.cloneNode(true);
        el2.parentNode.replaceChild(clone, el2);
      });

      function closeFsc() { backdrop.classList.remove('open'); unlockBodyScroll(); }

      /* Click fuori dal modal chiude e sblocca lo scroll */
      backdrop.addEventListener('click', e => { if (e.target === backdrop) closeFsc(); }, { once: true });

      /* NO → da ricontattare */
      document.getElementById('fscNoBtn').addEventListener('click', () => {
        client.conversionStatus = 'follow_up';
        saveState(true); renderAll(); closeFsc();
        showToast(`${getClientFullName(client)} segnato come da ricontattare.`, 'warn');
      });

      /* SKIP → decide dopo */
      document.getElementById('fscSkipBtn').addEventListener('click', closeFsc);

      /* SÌ → avvia percorso */
      document.getElementById('fscYesBtn').addEventListener('click', () => {
        const selEl = document.getElementById('fscPackageSelect');
        const prEl  = document.getElementById('fscPriceInput');
        const pkg   = getPackage(selEl?.value);
        if (!pkg) { showToast('Seleziona un pacchetto.', 'warn'); return; }
        const price = Number(prEl?.value);
        if (isNaN(price) || price < 0) { showToast('Inserisci un prezzo valido.', 'warn'); return; }

        /* Converti cliente */
        client.serviceType      = 'personal';
        client.freeSessionDone  = true;
        client.conversionStatus = 'path_started';
        client.packagePrice     = price;
        client.paymentStatus    = 'unpaid';
        client.paymentMode      = 'single';

        /* Crea nuovo piano */
        const newPlanId = uid('plan');
        state.plans.push({
          id: newPlanId, clientId: client.id, packageId: pkg.id,
          startDate: todayISO(), checkMode: '12',
          saleType: 'new', createdAt: new Date().toISOString()
        });
        client.activePlanId = newPlanId;

        /* Snapshot pagamento */
        ensureClientHistoryBuckets(client);
        pushClientPaymentSnapshot(client, 'create');

        saveState(true); renderAll(); closeFsc();
        showToast(`✅ Percorso avviato — ${escapeHtml(pkg.name)} · ${formatCurrency(price)}`, 'ok');
      });

      backdrop.classList.add('open');
      lockBodyScroll();
      requestAnimationFrame(() => document.getElementById('fscYesBtn')?.focus());
    }

    /* ═══════════════════════════════════════════════════════════
       MONTH PICKER — default = oggi, griglia 4×3 mesi
    ═══════════════════════════════════════════════════════════ */
    const MONTHS_IT_SHORT = ['Gen','Feb','Mar','Apr','Mag','Giu','Lug','Ago','Set','Ott','Nov','Dic'];

    function openMonthPicker(defaultDate, onConfirm) {
      const backdrop = document.getElementById('mpBackdrop');
      if (!backdrop) { onConfirm(defaultDate); return; }

      const todayM = new Date().getMonth();
      const todayY = new Date().getFullYear();
      let pickerY  = defaultDate.getFullYear();
      let pickerM  = defaultDate.getMonth();

      function renderMpGrid() {
        document.getElementById('mpYearLabel').textContent = pickerY;
        const grid = document.getElementById('mpGrid');
        grid.innerHTML = MONTHS_IT_SHORT.map((name, i) => {
          const isActive  = i === pickerM;
          const isCurrent = i === todayM && pickerY === todayY;
          return `<button class="mp-month-btn${isActive?' mp-active':''}${isCurrent&&!isActive?' mp-current':''}"
            data-m="${i}" type="button">${name}${isCurrent&&!isActive?' ·':''}</button>`;
        }).join('');
        grid.querySelectorAll('[data-m]').forEach(btn =>
          btn.addEventListener('click', () => { pickerM = +btn.dataset.m; renderMpGrid(); })
        );
      }

      /* Clone bottoni per eliminare listener stantii */
      ['mpPrevYear','mpNextYear','mpCancelBtn','mpConfirmBtn'].forEach(id => {
        const el2   = document.getElementById(id);
        const clone = el2.cloneNode(true);
        el2.parentNode.replaceChild(clone, el2);
      });

      document.getElementById('mpPrevYear').addEventListener('click',  () => { pickerY--; renderMpGrid(); });
      document.getElementById('mpNextYear').addEventListener('click',  () => { pickerY++; renderMpGrid(); });
      document.getElementById('mpCancelBtn').addEventListener('click', () => { backdrop.classList.remove('open'); unlockBodyScroll(); });
      document.getElementById('mpConfirmBtn').addEventListener('click', () => {
        backdrop.classList.remove('open'); unlockBodyScroll();
        onConfirm(new Date(pickerY, pickerM, 1));
      });

      backdrop.addEventListener('click', e => {
        if (e.target === backdrop) { backdrop.classList.remove('open'); unlockBodyScroll(); }
      }, { once: true });

      renderMpGrid();
      backdrop.classList.add('open');
      lockBodyScroll();
      requestAnimationFrame(() => document.getElementById('mpConfirmBtn')?.focus());
    }

        async function initApp() {
      loadStateLocal();
      resetPackageForm();
      el.clientStartDate.value = todayISO();
      /* Mostra skeleton subito mentre si caricano i dati */
      showClientSkeletons(6);
      
      /* 1. Carica le credenziali dal ponte Netlify */
      await loadRemoteConfig();
      
      /* 2. Recupera la configurazione (che ora dovrebbe avere le chiavi caricate) */
      const config = loadSupabaseConfig();
      console.log('[DSWORLD] Configurazione caricata:', config.url ? 'URL presente' : 'URL mancante');

      /* 3. Inizializza il client Supabase con la nuova configurazione */
      if (config.url && config.key) {
        const clientReady = initSupabaseClient(config);
        if (clientReady) {
          console.log('[DSWORLD] Client Supabase inizializzato con successo.');
        } else {
          console.error('[DSWORLD] Client Supabase NON inizializzato. Libreria o client non disponibile.');
        }
      } else {
        console.warn('[DSWORLD] Attenzione: Chiavi Supabase non trovate dopo loadRemoteConfig.');
      }

      persistSupabaseConfig(config);
      await ensureSupabaseReady();

      const currentUrl = new URL(window.location.href);
      const googleFlag = currentUrl.searchParams.get('google');
      const isRecoveryUrl = window.location.href.includes('type=recovery');
      
      if (isRecoveryUrl) {
        openModal('passwordUpdateModalBackdrop');
        updateAuthMessage('Imposta la nuova password per completare il reset.');
      }
      if (googleFlag === 'connected') {
        await refreshGoogleStatus();
        if (cloud.google.connected) await syncAllLessonsToGoogle(false);
        showToast('Google Calendar collegato.', 'ok');
        clearUrlParams(['google']);
      } else if (googleFlag === 'disconnected') {
        resetGoogleState();
        showToast('Google Calendar scollegato.', 'ok');
        clearUrlParams(['google']);
      } else if (googleFlag === 'error') {
        showToast('Connessione Google non riuscita.', 'error');
        clearUrlParams(['google', 'reason']);
      }
      renderAll();
      initInteractionDelegation();
      updateGoogleUi();
      initDebouncedSearch();
      initFormKeyboardNav();
      initMessagesModal();
      /* Prima carica il conteggio, poi avvia Realtime */
      refreshUnreadMessages();
      initRealtimeMessages();

      /* ── PWA: register Service Worker ────────────────────── */
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').catch(() => {});
      }

      /* ── PWA: show install banner ─────────────────────────── */
      initPWAInstallBanner();

      /* Smart auto-complete: schedule next tick at the exact minute the nearest lesson ends */
      (function scheduleNextAutoComplete() {
        const now = new Date();
        const next = state.lessons
          .filter(l => l.status === 'scheduled')
          .map(l => getLessonEndDate(l))
          .filter(d => d > now)
          .sort((a, b) => a - b)[0];
        const delay = next ? Math.max(15000, next - now + 2000) : 60000;
        setTimeout(() => {
          if (!_rendering && autoCompleteElapsedLessons()) renderAll();
          scheduleNextAutoComplete();
        }, delay);
      })();
    }

    /* ═══════════════════════════════════════════════════════════
       MOBILE DRAWER & BOTTOM NAV
    ═══════════════════════════════════════════════════════════ */
    (function initMobileUI() {
      const drawerOverlay = document.getElementById('drawerOverlay');
      const sidebarDrawer = document.getElementById('sidebarDrawer');
      const drawerCloseBtn = document.getElementById('drawerCloseBtn');
      const bnavClienti   = document.getElementById('bnavClienti');
      const bnavCalendario = document.getElementById('bnavCalendario');
      const bnavAddCliente = document.getElementById('bnavAddCliente');
      const bnavResoconto  = document.getElementById('bnavResoconto');
      const bnavPacchetti  = document.getElementById('bnavPacchetti');
      const openAccountBtnMobile = document.getElementById('openAccountBtnMobile');

      function openDrawer() {
        sidebarDrawer.classList.add('open');
        drawerOverlay.classList.add('open');
        lockBodyScroll();
        const search = document.getElementById('clientSearchDrawer');
        if (search) setTimeout(() => search.focus(), 260);
      }
      function closeDrawer() {
        sidebarDrawer.classList.remove('open');
        drawerOverlay.classList.remove('open');
        unlockBodyScroll();
      }

      if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);
      if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);
      if (bnavClienti) bnavClienti.addEventListener('click', () => { openDrawer(); setActiveBnav(bnavClienti); });
      if (bnavCalendario) bnavCalendario.addEventListener('click', () => {
        closeDrawer();
        document.querySelector('.calendar-wrap')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setActiveBnav(bnavCalendario);
      });
      if (bnavAddCliente) bnavAddCliente.addEventListener('click', event => { closeDrawer(); openNewClientModal(event.currentTarget); });
      if (bnavResoconto) bnavResoconto.addEventListener('click', () => { closeDrawer(); renderReport(); openModal('reportModalBackdrop'); });
      if (bnavPacchetti) bnavPacchetti.addEventListener('click', () => { closeDrawer(); renderPackages(); openModal('packagesModalBackdrop'); });
      if (openAccountBtnMobile) openAccountBtnMobile.addEventListener('click', async () => { populateCloudConfigInputs(); await refreshGoogleStatus(); openModal('accountModalBackdrop'); });

      function setActiveBnav(activeBtn) {
        document.querySelectorAll('.bnav-btn').forEach(b => b.classList.remove('active'));
        if (activeBtn) activeBtn.classList.add('active');
      }

      /* Sync drawer client search/filter with main state */
      const drawerSearch = document.getElementById('clientSearchDrawer');
      if (drawerSearch) {
        drawerSearch.addEventListener('input', event => {
          state.search = event.target.value;
          renderClientList();
        });
      }
      const drawerFilterRow = document.getElementById('clientFilterRowDrawer');
      if (drawerFilterRow) {
        drawerFilterRow.querySelectorAll('[data-drawer-filter]').forEach(button => {
          button.addEventListener('click', () => {
            state.clientFilter = button.getAttribute('data-drawer-filter');
            drawerFilterRow.querySelectorAll('[data-drawer-filter]').forEach(b => {
              const isActive = b.getAttribute('data-drawer-filter') === state.clientFilter;
              b.classList.toggle('active', isActive);
              b.setAttribute('aria-pressed', isActive ? 'true' : 'false');
            });
            /* sync main sidebar filter row */
            el.clientFilterRow?.querySelectorAll('[data-client-filter]').forEach(b => {
              const isActive = b.getAttribute('data-client-filter') === state.clientFilter;
              b.classList.toggle('active', isActive);
              b.setAttribute('aria-pressed', isActive ? 'true' : 'false');
            });
            renderClientList();
          });
        });
      }
      const exportBtnDrawer = document.getElementById('exportBtnDrawer');
      if (exportBtnDrawer) exportBtnDrawer.addEventListener('click', exportBackup);

      /* Mirror sync badge to mobile topbar */
      const syncBadgeMobile = document.getElementById('syncBadgeMobile');
      function mirrorSyncBadge() {
        if (!syncBadgeMobile) return;
        const main = document.getElementById('syncBadge');
        if (!main) return;
        const isOk = main.textContent.toLowerCase().includes('sincron') || main.textContent.toLowerCase().includes('cloud');
        syncBadgeMobile.style.color = isOk ? '#1db954' : 'rgba(255,255,255,0.4)';
        syncBadgeMobile.title = main.textContent;
      }
      const syncObserver = new MutationObserver(mirrorSyncBadge);
      const syncBadgeEl = document.getElementById('syncBadge');
      if (syncBadgeEl) syncObserver.observe(syncBadgeEl, { characterData: true, subtree: true, childList: true });

      /* Offline retry button */
      const offlineRetryBtn = document.getElementById('offlineRetryBtn');
      if (offlineRetryBtn) {
        offlineRetryBtn.addEventListener('click', async () => {
          document.getElementById('offlineBanner')?.classList.remove('show');
          const ok = await syncStateToCloud(true);
          if (ok) showToast('Sincronizzazione completata.', 'ok');
          else showToast('Ancora offline. Riprova più tardi.', 'error');
        });
      }

      /* Patch renderClientList to also populate drawer */
      const _origRenderAll = window._renderAllOrig || null;
    })();

    /* ── Navigazione automatica tra campi form con tasto Enter ── */
    /* ═══════════════════════════════════════════════════════════
       PORTALE CLIENTE — messaggi in arrivo (vista trainer)
    ═══════════════════════════════════════════════════════════ */

    /* Sostituisci con l'URL della tua Edge Function Supabase */
    /* ═══════════════════════════════════════════════════════════
       BADGE MESSAGGI NON LETTI — aggiorna tutti i badge
    ═══════════════════════════════════════════════════════════ */
    let _unreadMsgCount = 0;

    function updateMsgBadges(count) {
      _unreadMsgCount = count;
      const ids = ['msgBadgeBnav', 'msgBadgeMobileTopbar', 'msgBadgeDesktop'];
      ids.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.textContent = count > 9 ? '9+' : String(count);
        el.classList.toggle('show', count > 0);
      });
    }

    async function refreshUnreadMessages() {
      if (!cloud.user || !cloud.client || cloud.allowLocalOnly) return;
      try {
        /* Query singola su Supabase — le RLS filtrano automaticamente per user_id */
        const cfg = loadSupabaseConfig();
        if (!cfg.url || !cfg.key) return;
        const token = getAuthToken();
        if (!token) return;
        const res = await fetch(
          `${cfg.url.replace(/\/$/, '')}/rest/v1/client_messages?sender=eq.client&read=eq.false&select=id`,
          {
            headers: {
              'apikey': cfg.key,
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        if (!res.ok) return;
        const rows = await res.json();
        updateMsgBadges(Array.isArray(rows) ? rows.length : 0);
      } catch(e) {}
    }

    /* Polling ogni 60 secondi — fallback se Realtime non disponibile */
    function initMessagePolling() {
      refreshUnreadMessages();
      setInterval(refreshUnreadMessages, 60000);
    }

    /* ── Supabase Realtime — notifica istantanea nuovi messaggi ── */
    let _realtimeChannel = null;

    /* Invia broadcast al canale del portale cliente */
    function broadcastToClient(clientToken, event = 'new_message') {
      if (!cloud.client || !clientToken) return;
      try {
        cloud.client
          .channel(`portal-${clientToken}`)
          .send({ type: 'broadcast', event, payload: { ts: Date.now() } })
          .catch(() => {});
      } catch(e) {}
    }

    function initRealtimeMessages() {
      if (!cloud.client || !cloud.user || cloud.allowLocalOnly) return;

      /* Rimuovi canale precedente se esiste */
      if (_realtimeChannel) {
        cloud.client.removeChannel(_realtimeChannel);
        _realtimeChannel = null;
      }

      _realtimeChannel = cloud.client
        .channel('client-messages-' + cloud.user.id)
        .on('postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'client_messages', filter: `user_id=eq.${cloud.user.id}` },
          (payload) => {
            if (payload.new?.sender === 'client') {
              refreshUnreadMessages();
              if (_activeMsgClientId && payload.new?.client_id === _activeMsgClientId) {
                const client = getClient(_activeMsgClientId);
                if (client) openMsgChat(client);
              }
              haptic([10, 50, 10]);
            }
          }
        )
        .on('postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'client_messages', filter: `user_id=eq.${cloud.user.id}` },
          (payload) => {
            /* Aggiorna spunte in tempo reale quando il cliente legge */
            if (_activeMsgClientId) {
              const msgEl = document.querySelector(`[data-msg-id="${payload.new?.id}"]`);
              if (msgEl && payload.new?.sender === 'trainer') {
                const tickContainer = msgEl.querySelector('svg');
                if (tickContainer) {
                  const gray = 'rgba(255,255,255,0.45)';
                  const blue = '#53bdeb';
                  const mkPath = (d, c) => `<path d="${d}" stroke="${c}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>`;
                  const d1 = 'M1 4.5L4 7.5L9 2';
                  const d2 = 'M5 4.5L8 7.5L13 2';
                  if (payload.new.read) {
                    tickContainer.innerHTML = mkPath(d1, blue) + mkPath(d2, blue);
                  } else if (payload.new.delivered_at) {
                    tickContainer.innerHTML = mkPath(d1, gray) + mkPath(d2, gray);
                  }
                }
              }
            }
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.log('[DSWORLD] Realtime messaggi attivo.');
          } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
            console.warn('[DSWORLD] Realtime non disponibile, uso polling.');
            /* Fallback al polling se realtime fallisce */
            initMessagePolling();
          }
        });
    }

    function getPortalEdgeUrl() {
      const cfg = loadSupabaseConfig();
      return cfg.url ? cfg.url.replace(/\/$/, '') + '/functions/v1/client-portal' : '';
    }

    async function callPortalEdge(token, action, payload = {}) {
      const edgeUrl = getPortalEdgeUrl();
      if (!edgeUrl) return null;
      try {
        const cfg = loadSupabaseConfig();
        const res = await fetch(edgeUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': cfg.key || '',
            'Authorization': 'Bearer ' + (cfg.key || '')
          },
          body: JSON.stringify({ token, action, payload })
        });
        return await res.json();
      } catch(e) { return null; }
    }

    async function loadClientMessages(client) {
      const panel = document.getElementById('clientMessagesPanel');
      if (!panel || !client.shareToken) return;

      panel.style.display = 'block';
      panel.innerHTML = `
        <div style="font-size:0.72rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--muted);margin-bottom:8px;">
          Messaggi dal cliente
          <span id="msgLoadingIndicator" style="color:var(--warn);margin-left:6px;">caricamento…</span>
        </div>
        <div id="trainerMsgList" style="display:grid;gap:6px;max-height:220px;overflow-y:auto;"></div>
        <div style="display:flex;gap:8px;margin-top:10px;">
          <input id="trainerReplyInput" type="text" placeholder="Rispondi al cliente…"
            autocapitalize="sentences" autocorrect="off" enterkeyhint="send"
            style="flex:1;padding:10px 14px;background:#151515;border:1px solid rgba(255,255,255,0.08);color:#fff;border-radius:14px;font:inherit;font-size:0.88rem;outline:none;" />
          <button class="btn btn-primary btn-small" onclick="sendTrainerReply('${escapeHtml(client.shareToken)}')">Invia</button>
        </div>
      `;

      /* Query diretta a Supabase — RLS filtra per user_id automaticamente */
      const cfg = loadSupabaseConfig();
      const token = getAuthToken();
      const indicator = document.getElementById('msgLoadingIndicator');
      const msgList = document.getElementById('trainerMsgList');

      try {
        const res = await fetch(
          `${cfg.url.replace(/\/$/, '')}/rest/v1/client_messages?client_token=eq.${encodeURIComponent(client.shareToken)}&order=created_at.asc&select=*`,
          {
            headers: {
              'apikey': cfg.key,
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (indicator) indicator.remove();
        if (!msgList) return;

        if (!res.ok) {
          msgList.innerHTML = `<div style="font-size:0.82rem;color:var(--muted);">Errore caricamento messaggi (${res.status}).</div>`;
          return;
        }

        const messages = await res.json();

        if (!Array.isArray(messages) || !messages.length) {
          msgList.innerHTML = `<div style="font-size:0.82rem;color:var(--muted);">Nessun messaggio ancora.</div>`;
          return;
        }

        msgList.innerHTML = messages.map(m => renderMsgBubble(m, m.sender === 'trainer')).join('');
        msgList.scrollTop = msgList.scrollHeight;

        const now = new Date().toISOString();
        /* Segna messaggi del cliente come delivered + read */
        await fetch(
          `${cfg.url.replace(/\/$/, '')}/rest/v1/client_messages?client_token=eq.${encodeURIComponent(client.shareToken)}&sender=eq.client`,
          {
            method: 'PATCH',
            headers: {
              'apikey': cfg.key,
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=minimal'
            },
            body: JSON.stringify({ delivered_at: now, read: true })
          }
        );
        /* Aggiorna badge dopo lettura */
        refreshUnreadMessages();

      } catch(e) {
        if (indicator) indicator.remove();
        if (msgList) msgList.innerHTML = `<div style="font-size:0.82rem;color:var(--muted);">Errore connessione.</div>`;
      }
    }

    async function sendTrainerReply(clientToken) {
      const input = document.getElementById('trainerReplyInput');
      const text = input?.value?.trim();
      if (!text) return;
      input.value = '';
      haptic(6);

      const cfg = loadSupabaseConfig();
      const authToken = getAuthToken();
      const client = getClient(state.selectedClientId);
      if (!client || !cloud.user) { showToast('Errore: utente non trovato.', 'error'); return; }

      try {
        const res = await fetch(
          `${cfg.url.replace(/\/$/, '')}/rest/v1/client_messages`,
          {
            method: 'POST',
            headers: {
              'apikey': cfg.key,
              'Authorization': `Bearer ${authToken}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=minimal'
            },
            body: JSON.stringify({
              client_token: clientToken,
              user_id: cloud.user.id,
              client_id: client.id,
              sender: 'trainer',
              text,
              type: 'message',
              read: false
            })
          }
        );
        if (res.ok || res.status === 201) {
          showToast('Risposta inviata!', 'ok');
          loadClientMessages(client);
          /* Broadcast al portale cliente — notifica istantanea */
          broadcastToClient(clientToken, 'new_message');
        } else {
          showToast('Errore invio risposta.', 'error');
        }
      } catch(e) {
        showToast('Errore connessione.', 'error');
      }
    }

    /* ── Modal messaggi — lista clienti + chat ───────────────── */
    let _activeMsgClientToken = null;
    let _activeMsgClientId = null;

    async function openMessagesModal(preselectedClientId = null) {
      renderMessagesClientList(preselectedClientId);
      openModal('messagesModalBackdrop');
      if (preselectedClientId) {
        const client = getClient(preselectedClientId);
        if (client?.shareToken) openMsgChat(client);
      }
    }

    async function renderMessagesClientList(highlightId = null) {
      const listEl = document.getElementById('messagesClientList');
      if (!listEl) return;

      const cfg = loadSupabaseConfig();
      const token = getAuthToken();

      /* Carica conteggio messaggi non letti per cliente */
      let unreadByToken = {};
      try {
        const res = await fetch(
          `${cfg.url.replace(/\/$/, '')}/rest/v1/client_messages?sender=eq.client&read=eq.false&select=client_token`,
          { headers: { 'apikey': cfg.key, 'Authorization': `Bearer ${token}` } }
        );
        if (res.ok) {
          const rows = await res.json();
          rows.forEach(r => { unreadByToken[r.client_token] = (unreadByToken[r.client_token] || 0) + 1; });
        }
      } catch(e) {}

      const clientsWithPortal = state.clients.filter(c => c.shareToken);
      if (!clientsWithPortal.length) {
        listEl.innerHTML = `<div class="muted small" style="padding:12px;">Nessun cliente ha ancora il portale attivo.</div>`;
        return;
      }

      /* Ordina: non letti prima (più non letti = primo), poi alfabetico */
      const sorted = clientsWithPortal.slice().sort((a, b) => {
        const ua = unreadByToken[a.shareToken] || 0;
        const ub = unreadByToken[b.shareToken] || 0;
        if (ub !== ua) return ub - ua;
        return getClientFullName(a).localeCompare(getClientFullName(b));
      });

      /* Mostra/nascondi bottone "Segna tutti letti" */
      const totalUnread = Object.values(unreadByToken).reduce((s, v) => s + v, 0);
      const markAllBtn = document.getElementById('markAllReadBtn');
      if (markAllBtn) markAllBtn.style.display = totalUnread > 0 ? '' : 'none';

      listEl.innerHTML = sorted.map(c => {
        const unread = unreadByToken[c.shareToken] || 0;
        const isActive = c.id === _activeMsgClientId;
        return `
          <div class="msg-client-row ${unread > 0 ? 'has-unread' : ''} ${isActive ? 'active' : ''}"
            onclick="openMsgChatById('${c.id}')">
            <div class="avatar" style="width:34px;height:34px;font-size:0.78rem;flex-shrink:0;">${escapeHtml(initials(getClientFullName(c)))}</div>
            <div style="flex:1;min-width:0;">
              <strong style="display:block;font-size:0.9rem;${unread > 0 ? '' : 'opacity:0.7'}">${escapeHtml(getClientFullName(c))}</strong>
              <div style="font-size:0.75rem;color:var(--muted);">${unread > 0 ? `${unread} non letto${unread > 1 ? 'i' : ''}` : 'Nessun non letto'}</div>
            </div>
            ${unread > 0 ? `<span style="min-width:20px;height:20px;border-radius:99px;background:var(--accent);color:#fff;font-size:0.7rem;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;">${unread}</span>` : ''}
          </div>`;
      }).join('');
    }

    function openMsgChatById(clientId) {
      const client = getClient(clientId);
      if (client) openMsgChat(client);
    }

    /* ── Spunte stile WhatsApp ───────────────────────────────────
       ✓  grigia  = inviato (inserito nel DB)
       ✓✓ grigie  = consegnato (destinatario ha caricato la lista)
       ✓✓ blu     = letto (destinatario ha aperto la chat)
    ─────────────────────────────────────────────────────────── */
    function renderTicks(m) {
      /* Le spunte appaiono solo sui messaggi inviati da chi visualizza */
      const gray = 'rgba(255,255,255,0.45)';
      const blue = '#53bdeb';
      const svg = (color1, color2) =>
        `<svg width="14" height="9" viewBox="0 0 14 9" fill="none" style="flex-shrink:0;margin-left:3px;vertical-align:middle;" aria-hidden="true">
          <path d="M1 4.5L4 7.5L9 2" stroke="${color1}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
          ${color2 ? `<path d="M5 4.5L8 7.5L13 2" stroke="${color2}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>` : ''}
        </svg>`;
      if (m.read)          return svg(blue, blue);        // ✓✓ blu
      if (m.delivered_at)  return svg(gray, gray);        // ✓✓ grigie
      return svg(gray, null);                             // ✓  grigia
    }

    function renderMsgBubble(m, isSender) {
      const time = new Date(m.created_at).toLocaleString('it-IT', { day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit' });
      const typeBadge = m.type === 'cancel_request'
        ? `<span style="font-size:0.7rem;font-weight:700;padding:2px 7px;border-radius:6px;background:rgba(239,68,68,0.15);color:#ffb3b3;display:block;margin-bottom:3px;">Disdetta</span>`
        : m.type === 'reschedule_request'
        ? `<span style="font-size:0.7rem;font-weight:700;padding:2px 7px;border-radius:6px;background:rgba(245,158,11,0.15);color:var(--warn);display:block;margin-bottom:3px;">Spostamento</span>`
        : '';
      const ticks = isSender ? renderTicks(m) : '';
      return `
        <div style="display:flex;flex-direction:column;align-items:${isSender ? 'flex-end' : 'flex-start'};">
          <div data-msg-id="${m.id}" style="max-width:85%;padding:9px 13px;border-radius:${isSender ? '16px 4px 16px 16px' : '4px 16px 16px 16px'};background:${isSender ? 'rgba(229,9,20,0.16)' : 'rgba(255,255,255,0.07)'};border:1px solid ${isSender ? 'rgba(229,9,20,0.25)' : 'rgba(255,255,255,0.08)'};">
            ${typeBadge}
            <span style="font-size:0.88rem;">${escapeHtml(m.text)}</span>
            <div style="display:flex;align-items:center;justify-content:flex-end;gap:2px;margin-top:3px;">
              <span style="font-size:0.68rem;color:rgba(255,255,255,0.45);">${time}</span>
              ${ticks}
            </div>
          </div>
        </div>`;
    }

    async function openMsgChat(client) {
      _activeMsgClientToken = client.shareToken;
      _activeMsgClientId = client.id;

      const body = document.querySelector('.messages-modal-body');
      const chatEl = document.getElementById('messagesChat');
      const nameEl = document.getElementById('msgChatClientName');
      const chatList = document.getElementById('msgChatList');
      const sub = document.getElementById('messagesModalSub');

      /* Mobile: show-chat class nasconde sidebar e mostra chat */
      if (body) body.classList.add('show-chat');
      if (chatEl) chatEl.style.display = 'flex';
      if (nameEl) nameEl.textContent = getClientFullName(client);
      if (sub) sub.textContent = getClientFullName(client);
      if (chatList) chatList.innerHTML = `<div class="muted small" style="padding:8px 0;">Caricamento…</div>`;

      /* Aggiorna sidebar per evidenziare il cliente attivo */
      renderMessagesClientList();

      const cfg = loadSupabaseConfig();
      const token = getAuthToken();

      try {
        const res = await fetch(
          `${cfg.url.replace(/\/$/, '')}/rest/v1/client_messages?client_token=eq.${encodeURIComponent(client.shareToken)}&order=created_at.asc&select=*`,
          { headers: { 'apikey': cfg.key, 'Authorization': `Bearer ${token}` } }
        );
        const messages = res.ok ? await res.json() : [];

        if (!chatList) return;
        if (!Array.isArray(messages) || !messages.length) {
          chatList.innerHTML = `<div class="muted small">Nessun messaggio ancora.</div>`;
        } else {
          chatList.innerHTML = messages.map(m => renderMsgBubble(m, m.sender === 'trainer')).join('');
          chatList.scrollTop = chatList.scrollHeight;
        }

        const now = new Date().toISOString();
        /* Segna messaggi del cliente come delivered + read */
        await fetch(
          `${cfg.url.replace(/\/$/, '')}/rest/v1/client_messages?client_token=eq.${encodeURIComponent(client.shareToken)}&sender=eq.client`,
          { method: 'PATCH', headers: { 'apikey': cfg.key, 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
            body: JSON.stringify({ delivered_at: now, read: true }) }
        );
        refreshUnreadMessages();

      } catch(e) {
        if (chatList) chatList.innerHTML = `<div class="muted small">Errore caricamento.</div>`;
      }
    }

    async function sendMsgChatReply() {
      const input = document.getElementById('msgChatInput');
      const text = input?.value?.trim();
      if (!text || !_activeMsgClientToken || !_activeMsgClientId) return;
      input.value = '';
      haptic(6);
      const cfg = loadSupabaseConfig();
      const token = getAuthToken();
      const client = getClient(_activeMsgClientId);
      if (!client || !cloud.user) return;
      try {
        await fetch(`${cfg.url.replace(/\/$/, '')}/rest/v1/client_messages`, {
          method: 'POST',
          headers: { 'apikey': cfg.key, 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
          body: JSON.stringify({ client_token: _activeMsgClientToken, user_id: cloud.user.id, client_id: client.id, sender: 'trainer', text, type: 'message', read: false })
        });
        showToast('Risposta inviata!', 'ok');
        openMsgChat(client);
        loadClientMessages(client);
        /* Broadcast al portale cliente — notifica istantanea */
        broadcastToClient(_activeMsgClientToken, 'new_message');
      } catch(e) { showToast('Errore invio.', 'error'); }
    }

    function initMessagesModal() {
      /* Bottone indietro — mobile torna alla lista */
      document.getElementById('msgBackBtn')?.addEventListener('click', () => {
        const body = document.querySelector('.messages-modal-body');
        if (body) body.classList.remove('show-chat');
        document.getElementById('messagesChat').style.display = 'none';
        document.getElementById('messagesModalSub').textContent = 'Conversazioni con i clienti';
        _activeMsgClientToken = null;
        _activeMsgClientId = null;
        renderMessagesClientList();
      });

      /* Bottone Segna tutti letti */
      document.getElementById('markAllReadBtn')?.addEventListener('click', async () => {
        const cfg = loadSupabaseConfig();
        const token = getAuthToken();
        try {
          await fetch(
            `${cfg.url.replace(/\/$/, '')}/rest/v1/client_messages?sender=eq.client&read=eq.false&user_id=eq.${cloud.user.id}`,
            { method: 'PATCH', headers: { 'apikey': cfg.key, 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' }, body: JSON.stringify({ read: true }) }
          );
          refreshUnreadMessages();
          renderMessagesClientList();
          showToast('Tutti i messaggi segnati come letti.', 'ok');
        } catch(e) { showToast('Errore.', 'error'); }
      });

      /* Bottone invia */
      document.getElementById('msgChatSendBtn')?.addEventListener('click', sendMsgChatReply);
      document.getElementById('msgChatInput')?.addEventListener('keydown', e => {
        if (e.key === 'Enter') { e.preventDefault(); sendMsgChatReply(); }
      });

      /* Bottoni apertura modal */
      document.getElementById('openMessagesMobileBtn')?.addEventListener('click', () => openMessagesModal());
      document.getElementById('openMessagesBtn')?.addEventListener('click', () => openMessagesModal());

      /* Reset show-chat quando si chiude il modal */
      document.getElementById('messagesModalBackdrop')?.addEventListener('click', e => {
        if (e.target === e.currentTarget) {
          document.querySelector('.messages-modal-body')?.classList.remove('show-chat');
          _activeMsgClientToken = null;
          _activeMsgClientId = null;
        }
      });
    }

    function initFormKeyboardNav() {
      document.addEventListener('keydown', e => {
        if (e.key !== 'Enter') return;
        const el = e.target;
        if (!['INPUT', 'SELECT'].includes(el.tagName)) return;
        if (el.tagName === 'SELECT') return;
        if (el.getAttribute('enterkeyhint') === 'done') { el.blur(); return; }
        e.preventDefault();
        const form = el.closest('form');
        if (!form) return;
        const focusable = Array.from(form.querySelectorAll('input:not([type=hidden]):not([disabled]), select:not([disabled]), textarea:not([disabled])'));
        const idx = focusable.indexOf(el);
        if (idx >= 0 && idx < focusable.length - 1) {
          focusable[idx + 1].focus();
        } else {
          el.blur();
        }
      });
    }

    /* ── Swipe orizzontale sul calendario per cambiare periodo ── */
    (function initCalendarSwipe() {
      const calWrap = document.querySelector('.calendar-wrap');
      if (!calWrap) return;
      let startX = 0, startY = 0, moved = false;
      calWrap.addEventListener('touchstart', e => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        moved = false;
      }, { passive: true });
      calWrap.addEventListener('touchmove', e => {
        const dx = Math.abs(e.touches[0].clientX - startX);
        const dy = Math.abs(e.touches[0].clientY - startY);
        if (dx > dy && dx > 8) moved = true;
      }, { passive: true });
      calWrap.addEventListener('touchend', e => {
        if (!moved) return;
        const dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dx) < 50) return;
        haptic(6);
        moveCalendar(dx < 0 ? 1 : -1);
      }, { passive: true });
    })();

    /* ── Service Worker background sync message handler ─── */
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', event => {
        if (event.data?.type === 'SYNC_REQUESTED') {
          if (cloud.client && cloud.user && !cloud.allowLocalOnly) {
            syncStateToCloud(true).catch(err => console.error('BG sync failed:', err));
          }
        }
      });
    }

    /* ── Network online/offline detection ────────────────── */
    window.addEventListener('online', () => {
      showToast('Connessione ripristinata.', 'ok');
      document.getElementById('offlineBanner')?.classList.remove('show');
      if (cloud.client && cloud.user && !cloud.allowLocalOnly) {
        syncStateToCloud(true).catch(err => console.error('Reconnect sync failed:', err));
      }
    });
    window.addEventListener('offline', () => {
      showToast('Connessione persa — modalità offline.', 'warn');
      document.getElementById('offlineBanner')?.classList.add('show');
      updateSyncBadge('Offline');
    });

    // Attende che window.supabase sia disponibile (necessario con CDN di fallback asincroni)
    (function waitForSupabase(attempts) {
      if (window.supabase && window.supabase.createClient) {
        initApp();
      } else if (attempts > 0) {
        setTimeout(function () { waitForSupabase(attempts - 1); }, 150);
      } else {
        console.error('[DSWORLD] supabase-js non caricato dopo tutti i tentativi CDN.');
        // Avvia comunque l'app in modalità solo locale
        initApp();
      }
    })(40); // 40 × 150ms = 6 secondi max di attesa
  
/* App version badge */
(function renderAppVersionBadge() {
  const versionBadge = document.getElementById('appVersionBadge');
  if (versionBadge) {
    versionBadge.textContent = `DSWORLD v${APP_VERSION}`;
  }
})();
