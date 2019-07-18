import $ from 'jquery';
$(function() {
  $('#charAll').on('click', function() {
    $('.charCheckbox').prop('checked', $(this).prop('checked'));
  });
  $('.charCheckbox').change(function() {
    if ($('.charCheckbox:checked').length === $('.charCheckbox').length) {
      $('#charAll').prop('checked', true);
    } else {
      $('#charAll').prop('checked', false);
    }
  });
  $('#imagingSelectAll').on('click', function() {
    $('.imagingCheckbox').prop('checked', $(this).prop('checked'));
  });
  $('.imagingCheckbox').on('change', function() {
    if ($('.imagingCheckbox:checked').length === $('.imagingCheckbox').length) {
      $('#imagingSelectAll').prop('checked', true);
    } else {
      $('#imagingSelectAll').prop('checked', false);
    }
  });
  $('#documentSelectAll').on('click', function() {
    $('.documentCheckbox').prop('checked', $(this).prop('checked'));
  });
  $('.documentCheckbox').on('change', function() {
    if (
      $('.documentCheckbox:checked').length === $('.documentCheckbox').length
    ) {
      $('#documentSelectAll').prop('checked', true);
    } else {
      $('#documentSelectAll').prop('checked', false);
    }
  });
  $('#systemEntriesSelectAll').on('click', function() {
    $('.systemEntriesCheckbox').prop('checked', $(this).prop('checked'));
  });
  $('.systemEntriesCheckbox').on('change', function() {
    if (
      $('.systemEntriesCheckbox:checked').length ===
      $('.systemEntriesCheckbox').length
    ) {
      $('#systemEntriesSelectAll').prop('checked', true);
    } else {
      $('#systemEntriesSelectAll').prop('checked', false);
    }
  });
  $('#vitalSignSelectAll').on('click', function() {
    $('.vitalSignCheckbox').prop('checked', $(this).prop('checked'));
  });
  $('.vitalSignCheckbox').on('change', function() {
    if (
      $('.vitalSignCheckbox:checked').length === $('.vitalSignCheckbox').length
    ) {
      $('#vitalSignSelectAll').prop('checked', true);
    } else {
      $('#vitalSignSelectAll').prop('checked', false);
    }
  });
  $('#bloodPessureSelectAll').on('click', function() {
    $('.bloodPessureCheckbox').prop('checked', $(this).prop('checked'));
  });
  $('.bloodPessureCheckbox').on('change', function() {
    if (
      $('.bloodPessureCheckbox:checked').length ===
      $('.bloodPessureCheckbox').length
    ) {
      $('#bloodPessureSelectAll').prop('checked', true);
    } else {
      $('#bloodPessureSelectAll').prop('checked', false);
    }
  });
  $('#meanArterialSelectAll').on('click', function() {
    $('.meanArterialCheckBox').prop('checked', $(this).prop('checked'));
  });
  $('.meanArterialCheckBox').on('change', function() {
    if (
      $('.meanArterialCheckBox:checked').length ===
      $('.meanArterialCheckBox').length
    ) {
      $('#meanArterialSelectAll').prop('checked', true);
    } else {
      $('#meanArterialSelectAll').prop('checked', false);
    }
  });
  $('#heartRateSelectAll').on('click', function() {
    $('.heartRateCheckbox').prop('checked', $(this).prop('checked'));
  });
  $('.heartRateCheckbox').on('change', function() {
    if (
      $('.heartRateCheckbox:checked').length === $('.heartRateCheckbox').length
    ) {
      $('#heartRateSelectAll').prop('checked', true);
    } else {
      $('#heartRateSelectAll').prop('checked', false);
    }
  });
  $('#respiratoryRateSelectAll').on('click', function() {
    $('.respiratoryRateCheckbox').prop('checked', $(this).prop('checked'));
  });
  $('.respiratoryRateCheckbox').on('change', function() {
    if (
      $('.respiratoryRateCheckbox:checked').length ===
      $('.respiratoryRateCheckbox').length
    ) {
      $('#respiratoryRateSelectAll').prop('checked', true);
    } else {
      $('#respiratoryRateSelectAll').prop('checked', false);
    }
  });
  $('#o2SaturationSelectAll').on('click', function() {
    $('.o2SaturationCheckbox').prop('checked', $(this).prop('checked'));
  });
  $('.o2SaturationCheckbox').on('change', function() {
    if (
      $('.o2SaturationCheckbox:checked').length ===
      $('.o2SaturationCheckbox').length
    ) {
      $('#o2SaturationSelectAll').prop('checked', true);
    } else {
      $('#o2SaturationSelectAll').prop('checked', false);
    }
  });
  $('input[value="Dose"]').on('click', function() {
    $('input[value="Medications taken"]').prop(
      'checked',
      $(this).prop('checked')
    );
  });
});
