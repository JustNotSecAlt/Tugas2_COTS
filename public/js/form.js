$(document).ready(function () {
  // Inisialisasi jQuery plugin Select2 untuk dropdown jurusan
  $('#jurusan').select2({
    theme: 'bootstrap-5',
    placeholder: '-- Pilih Jurusan --',
    width: '100%'
  });

  function showAlert(type, message) {
    const html = `
      <div class="alert alert-${type} alert-dismissible fade show" role="alert">
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      </div>`;
    $('#alertContainer').html(html);
  }

  function setFlash(type, message) {
    sessionStorage.setItem('flashMessage', JSON.stringify({ type, message }));
  }

  // Mode edit jika ada query string ?id=
  const params = new URLSearchParams(window.location.search);
  const editId = params.get('id');
  let mode = 'create';

  if (editId) {
    mode = 'edit';
    $('#formTitle').text('Edit Mahasiswa');
    $('#btnSubmitText').text('Perbarui');
    $.getJSON(`/api/mahasiswa/${editId}`)
      .done(function (m) {
        $('#mahasiswaId').val(m.id);
        $('#nim').val(m.nim);
        $('#nama').val(m.nama);
        $('#jurusan').val(m.jurusan).trigger('change');
        $('#angkatan').val(m.angkatan);
        $('#email').val(m.email);
      })
      .fail(function () {
        showAlert('danger', 'Data tidak ditemukan. Anda akan dialihkan.');
        setTimeout(() => (window.location.href = '/data.html'), 1500);
      });
  }

  // Validasi form menggunakan jQuery Validate (jQuery plugin)
  $('#formMahasiswa').validate({
    rules: {
      nim: { required: true, minlength: 3 },
      nama: { required: true, minlength: 3 },
      jurusan: { required: true },
      angkatan: { required: true, digits: true, min: 2000, max: 2100 },
      email: { required: true, email: true }
    },
    messages: {
      nim: { required: 'NIM wajib diisi', minlength: 'Minimal 3 karakter' },
      nama: { required: 'Nama wajib diisi', minlength: 'Minimal 3 karakter' },
      jurusan: { required: 'Pilih jurusan' },
      angkatan: {
        required: 'Angkatan wajib diisi',
        digits: 'Hanya angka',
        min: 'Tahun minimal 2000',
        max: 'Tahun maksimal 2100'
      },
      email: { required: 'Email wajib diisi', email: 'Format email tidak valid' }
    },
    errorClass: 'is-invalid',
    validClass: 'is-valid',
    errorElement: 'div',
    errorPlacement: function (error, element) {
      error.addClass('invalid-feedback');
      if (element.attr('id') === 'jurusan') {
        error.insertAfter(element.next('.select2'));
      } else {
        error.insertAfter(element);
      }
    },
    highlight: function (element) {
      $(element).addClass('is-invalid').removeClass('is-valid');
    },
    unhighlight: function (element) {
      $(element).removeClass('is-invalid').addClass('is-valid');
    },
    submitHandler: function (form) {
      const data = {
        nim: $('#nim').val().trim(),
        nama: $('#nama').val().trim(),
        jurusan: $('#jurusan').val(),
        angkatan: $('#angkatan').val(),
        email: $('#email').val().trim()
      };

      const $btn = $('#btnSubmit');
      const originalHtml = $btn.html();
      $btn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm"></span> Menyimpan...');

      const ajaxOpts =
        mode === 'edit'
          ? { url: `/api/mahasiswa/${editId}`, type: 'PUT' }
          : { url: '/api/mahasiswa', type: 'POST' };

      $.ajax({
        ...ajaxOpts,
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (res) {
          setFlash('success', res.message || 'Data berhasil disimpan.');
          window.location.href = '/data.html';
        },
        error: function (xhr) {
          const msg = (xhr.responseJSON && xhr.responseJSON.message) || 'Terjadi kesalahan saat menyimpan data.';
          showAlert('danger', msg);
          $btn.prop('disabled', false).html(originalHtml);
        }
      });

      return false;
    }
  });

  // Validasi ulang Select2 saat berubah
  $('#jurusan').on('change', function () {
    $(this).valid();
  });
});
