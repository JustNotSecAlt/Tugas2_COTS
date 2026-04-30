$(document).ready(function () {
  let idHapus = null;

  function showAlert(type, message) {
    const html = `
      <div class="alert alert-${type} alert-dismissible fade show" role="alert">
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      </div>`;
    $('#alertContainer').html(html);
    setTimeout(() => $('#alertContainer .alert').alert('close'), 4000);
  }

  // Cek flash message dari halaman form
  const flash = sessionStorage.getItem('flashMessage');
  if (flash) {
    const { type, message } = JSON.parse(flash);
    showAlert(type, message);
    sessionStorage.removeItem('flashMessage');
  }

  // Inisialisasi DataTables dengan sumber data JSON dari API
  const table = $('#tableMahasiswa').DataTable({
    ajax: {
      url: '/api/mahasiswa',
      dataSrc: 'data'
    },
    responsive: true,
    order: [[0, 'asc']],
    language: {
      search: 'Cari:',
      lengthMenu: 'Tampilkan _MENU_ data',
      info: 'Menampilkan _START_ - _END_ dari _TOTAL_ data',
      infoEmpty: 'Tidak ada data',
      infoFiltered: '(disaring dari _MAX_ data)',
      zeroRecords: 'Data tidak ditemukan',
      emptyTable: 'Belum ada data mahasiswa',
      paginate: {
        first: 'Awal',
        last: 'Akhir',
        next: 'Selanjutnya',
        previous: 'Sebelumnya'
      }
    },
    columns: [
      { data: 'id' },
      { data: 'nim' },
      { data: 'nama' },
      { data: 'jurusan' },
      { data: 'angkatan' },
      { data: 'email' },
      {
        data: null,
        orderable: false,
        searchable: false,
        className: 'text-center',
        render: function (row) {
          return `
            <button class="btn btn-sm btn-info action-btn btn-detail" data-id="${row.id}" title="Detail">
              <i class="bi bi-eye"></i>
            </button>
            <a href="/form.html?id=${row.id}" class="btn btn-sm btn-warning action-btn" title="Edit">
              <i class="bi bi-pencil-square"></i>
            </a>
            <button class="btn btn-sm btn-danger action-btn btn-hapus"
                    data-id="${row.id}" data-nama="${row.nama}" title="Hapus">
              <i class="bi bi-trash"></i>
            </button>`;
        }
      }
    ]
  });

  // Detail
  $('#tableMahasiswa tbody').on('click', '.btn-detail', function () {
    const id = $(this).data('id');
    $.getJSON(`/api/mahasiswa/${id}`, function (m) {
      const created = m.createdAt ? new Date(m.createdAt).toLocaleString('id-ID') : '-';
      const updated = m.updatedAt ? new Date(m.updatedAt).toLocaleString('id-ID') : '-';
      $('#detailBody').html(`
        <tr><th width="35%">ID</th><td>: ${m.id}</td></tr>
        <tr><th>NIM</th><td>: ${m.nim}</td></tr>
        <tr><th>Nama</th><td>: ${m.nama}</td></tr>
        <tr><th>Jurusan</th><td>: ${m.jurusan}</td></tr>
        <tr><th>Angkatan</th><td>: ${m.angkatan}</td></tr>
        <tr><th>Email</th><td>: ${m.email}</td></tr>
        <tr><th>Dibuat</th><td>: ${created}</td></tr>
        <tr><th>Diperbarui</th><td>: ${updated}</td></tr>
      `);
      new bootstrap.Modal('#modalDetail').show();
    }).fail(() => showAlert('danger', 'Gagal memuat detail data.'));
  });

  // Trigger modal hapus
  $('#tableMahasiswa tbody').on('click', '.btn-hapus', function () {
    idHapus = $(this).data('id');
    $('#hapusNama').text($(this).data('nama'));
    new bootstrap.Modal('#modalHapus').show();
  });

  // Konfirmasi hapus
  $('#btnConfirmHapus').on('click', function () {
    if (!idHapus) return;
    const $btn = $(this);
    $btn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm"></span> Menghapus...');

    $.ajax({
      url: `/api/mahasiswa/${idHapus}`,
      type: 'DELETE',
      success: function (res) {
        bootstrap.Modal.getInstance(document.getElementById('modalHapus')).hide();
        showAlert('success', res.message || 'Data berhasil dihapus.');
        table.ajax.reload(null, false);
      },
      error: function () {
        showAlert('danger', 'Gagal menghapus data.');
      },
      complete: function () {
        $btn.prop('disabled', false).html('<i class="bi bi-trash"></i> Ya, Hapus');
        idHapus = null;
      }
    });
  });
});
