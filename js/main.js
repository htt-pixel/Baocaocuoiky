(function () {
  'use strict';

  const APPOINTMENTS_KEY = 'mentorMentee.appointments.v1';
  const APPOINTMENT_FORM_SELECTOR =
    'form[data-appointment-form], form#appointmentForm';

  function readAppointments() {
    const stored = window.localStorage.getItem(APPOINTMENTS_KEY);
    if (!stored) return [];

    const appointments = JSON.parse(stored);
    if (!Array.isArray(appointments)) {
      throw new Error('Dữ liệu lịch hẹn không đúng định dạng.');
    }

    return appointments;
  }

  function saveAppointment(appointment) {
    const appointments = readAppointments();
    appointments.unshift(appointment);
    window.localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
  }

  function getValue(values, aliases) {
    for (const alias of aliases) {
      const value = values[alias];
      if (value !== undefined && String(value).trim() !== '') {
        return String(value).trim();
      }
    }
    return '';
  }

  function normalizeAppointment(values) {
    const appointment = Object.assign({}, values);
    appointment.mentorName = getValue(values, [
      'mentorName', 'mentor_name', 'mentor', 'advisorName', 'advisor'
    ]);
    appointment.menteeName = getValue(values, [
      'menteeName', 'mentee_name', 'studentName', 'student', 'learnerName'
    ]);
    appointment.date = getValue(values, [
      'date', 'appointmentDate', 'appointment_date', 'bookingDate'
    ]);
    appointment.time = getValue(values, [
      'time', 'appointmentTime', 'appointment_time', 'bookingTime'
    ]);
    appointment.topic = getValue(values, [
      'topic', 'subject', 'course', 'purpose', 'reason'
    ]);
    appointment.notes = getValue(values, ['notes', 'message', 'description']);
    appointment.id =
      values.id || (window.crypto && window.crypto.randomUUID
        ? window.crypto.randomUUID()
        : String(Date.now()) + '-' + Math.random().toString(36).slice(2));
    appointment.createdAt = values.createdAt || new Date().toISOString();
    return appointment;
  }

  function showFormMessage(form, message, isError) {
    let output = form.querySelector('[data-appointment-feedback]');
    if (!output) {
      output = document.createElement('p');
      output.setAttribute('data-appointment-feedback', '');
      output.setAttribute('role', isError ? 'alert' : 'status');
      form.appendChild(output);
    }
    output.textContent = message;
    output.setAttribute('role', isError ? 'alert' : 'status');
  }

  function registerAppointmentForm(form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      const values = Object.fromEntries(new FormData(form).entries());
      const appointment = normalizeAppointment(values);

      if (!appointment.mentorName || !appointment.date || !appointment.time) {
        showFormMessage(
          form,
          'Vui lòng cung cấp tên cố vấn, ngày và giờ hẹn.',
          true
        );
        return;
      }

      try {
        saveAppointment(appointment);
      } catch (error) {
        console.error('Không thể lưu lịch hẹn.', error);
        showFormMessage(
          form,
          'Không thể lưu lịch hẹn trên trình duyệt này. Vui lòng thử lại.',
          true
        );
        return;
      }

      showFormMessage(form, 'Đã lưu lịch hẹn.', false);
      if (form.dataset.appointmentRedirect !== 'false') {
        window.location.assign(new URL('appointments.html', document.baseURI));
      }
    });
  }

  function registerAppointmentEvents() {
    document.querySelectorAll(APPOINTMENT_FORM_SELECTOR).forEach(registerAppointmentForm);

    document.addEventListener('mentor:appointment-created', function (event) {
      const values = event.detail && (event.detail.appointment || event.detail);
      if (!values || typeof values !== 'object') {
        console.error('Sự kiện lịch hẹn cần chứa dữ liệu appointment.');
        return;
      }

      try {
        saveAppointment(normalizeAppointment(values));
      } catch (error) {
        console.error('Không thể lưu lịch hẹn nhận được từ sự kiện.', error);
      }
    });
  }

  function renderAppointments() {
    const list = document.querySelector('[data-appointments-list]');
    if (!list) return;

    const status = document.querySelector('[data-appointments-status]');
    let appointments;
    try {
      appointments = readAppointments();
    } catch (error) {
      console.error('Không thể đọc dữ liệu lịch hẹn.', error);
      if (status) {
        status.textContent = 'Không thể đọc dữ liệu lịch hẹn đã lưu.';
        status.setAttribute('role', 'alert');
      }
      return;
    }

    list.replaceChildren();
    if (appointments.length === 0) {
      if (status) status.textContent = 'Bạn chưa có lịch hẹn nào.';
      return;
    }
    if (status) status.textContent = '';

    appointments.forEach(function (appointment) {
      const item = document.createElement('li');
      const heading = document.createElement('h2');
      heading.textContent = appointment.mentorName || 'Cố vấn chưa xác định';
      item.appendChild(heading);

      const details = [
        ['Người học', appointment.menteeName],
        ['Thời gian', [appointment.date, appointment.time].filter(Boolean).join(' - ')],
        ['Chủ đề', appointment.topic],
        ['Ghi chú', appointment.notes]
      ];
      details.forEach(function (detail) {
        if (!detail[1]) return;
        const paragraph = document.createElement('p');
        paragraph.textContent = detail[0] + ': ' + detail[1];
        item.appendChild(paragraph);
      });

      const removeButton = document.createElement('button');
      removeButton.type = 'button';
      removeButton.textContent = 'Hủy lịch hẹn';
      removeButton.setAttribute('data-remove-appointment', appointment.id);
      item.appendChild(removeButton);
      list.appendChild(item);
    });
  }

  function registerAppointmentManagement() {
    const list = document.querySelector('[data-appointments-list]');
    if (!list) return;

    list.addEventListener('click', function (event) {
      const button = event.target.closest('[data-remove-appointment]');
      if (!button) return;
      try {
        const remaining = readAppointments().filter(function (appointment) {
          return appointment.id !== button.dataset.removeAppointment;
        });
        window.localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(remaining));
        renderAppointments();
      } catch (error) {
        console.error('Không thể cập nhật lịch hẹn.', error);
        const status = document.querySelector('[data-appointments-status]');
        if (status) {
          status.textContent = 'Không thể cập nhật lịch hẹn. Vui lòng thử lại.';
          status.setAttribute('role', 'alert');
        }
      }
    });
  }

  function initializeSectionRouter() {
    const router = document.querySelector('[data-router]');
    if (!router) return;

    const pages = Array.from(router.querySelectorAll('[data-page]'));
    if (pages.length === 0) return;
    let activePage = null;
    let transitionId = 0;

    function activate(page, updateHistory, animate) {
      const previousPage = activePage;
      const currentTransition = ++transitionId;
      pages.forEach(function (candidate) {
        candidate.getAnimations().forEach(function (animation) {
          animation.cancel();
        });
        if (candidate !== page && candidate !== previousPage) {
          candidate.hidden = true;
          candidate.setAttribute('aria-hidden', 'true');
        }
      });

      page.hidden = false;
      page.setAttribute('aria-hidden', 'false');
      activePage = page;
      if (previousPage && previousPage !== page) {
        previousPage.setAttribute('aria-hidden', 'true');
        const reducedMotion = window.matchMedia &&
          window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (animate && !reducedMotion) {
          page.animate(
            [{ opacity: 0 }, { opacity: 1 }],
            { duration: 180, easing: 'ease-out' }
          );
          previousPage.animate(
            [{ opacity: 1 }, { opacity: 0 }],
            { duration: 180, easing: 'ease-in' }
          );
          window.setTimeout(function () {
            if (transitionId === currentTransition && activePage === page) {
              previousPage.hidden = true;
            }
          }, 180);
        } else {
          previousPage.hidden = true;
        }
      }

      pages.forEach(function (candidate) {
        if (candidate !== page && candidate !== previousPage) {
          candidate.hidden = true;
        }
      });
      if (updateHistory) {
        window.history.pushState(null, '', '#' + encodeURIComponent(page.id));
      }
    }

    function pageForLocation() {
      const id = decodeURIComponent(window.location.hash.slice(1));
      return pages.find(function (page) {
        return page.id === id;
      }) || pages[0];
    }

    document.addEventListener('click', function (event) {
      const link = event.target.closest('a[data-route], a[href^="#"]');
      if (!link || event.defaultPrevented || event.button !== 0 ||
          event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const targetId = link.dataset.route || decodeURIComponent(
        new URL(link.href, document.baseURI).hash.slice(1)
      );
      const target = pages.find(function (page) {
        return page.id === targetId;
      });
      if (!target) return;

      event.preventDefault();
      activate(target, true, true);
    });

    window.addEventListener('popstate', function () {
      activate(pageForLocation(), false);
    });
    window.addEventListener('hashchange', function () {
      activate(pageForLocation(), false);
    });
    activate(pageForLocation(), false, false);
  }

  function markCurrentNavigationLink() {
    const currentPath = window.location.pathname.replace(/\/+$/, '') || '/';
    document.querySelectorAll('a[href]').forEach(function (link) {
      const url = new URL(link.href, document.baseURI);
      const linkPath = url.pathname.replace(/\/+$/, '') || '/';
      if (url.origin === window.location.origin && linkPath === currentPath) {
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initializeSectionRouter();
    markCurrentNavigationLink();
    registerAppointmentEvents();
    registerAppointmentManagement();
    renderAppointments();
  });
})();
