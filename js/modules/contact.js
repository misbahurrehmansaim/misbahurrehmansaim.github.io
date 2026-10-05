/* Contact: builds a ready-to-send email draft in the visitor's own mail app.
   Static-site friendly: nothing is sent to or stored by any server. */

const EMAIL = 'saim.letsconnectnow@gmail.com';

export function init(form) {
  const status = form.querySelector('#form-status');
  const copyBtn = form.querySelector('#copy-mail');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = (data.get('name') || '').toString().trim();
    const site = (data.get('site') || '').toString().trim();
    const goal = (data.get('goal') || '').toString();
    const msg = (data.get('msg') || '').toString().trim();

    const subject = `Growth enquiry: ${goal}`;
    const body = [
      `Hi Misbah,`,
      ``,
      `${name ? `I'm ${name}. ` : ''}I'd like help with: ${goal}.`,
      site ? `Website or business: ${site}` : '',
      msg ? `\n${msg}` : '',
      ``,
      name ? `Thanks,\n${name}` : 'Thanks'
    ].filter((line, i, arr) => !(line === '' && arr[i - 1] === '')).join('\n');

    status.textContent = 'Opening your email app. If nothing opens, use "Copy email address" and write to me directly.';
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });

  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      status.textContent = 'Email address copied.';
    } catch {
      status.textContent = `Copy this address: ${EMAIL}`;
    }
  });
}
