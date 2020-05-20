import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Feedback, ContactType } from '../shared/feedback';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {
  feedback: Feedback;
  feedbackForm: FormGroup;
  contactType = ContactType;

  @ViewChild('fform') feedbackFormDirective;

  constructor(private formBuilder: FormBuilder) {
    this.createForm();
  }

  ngOnInit(): void {}

  createForm() {
    this.feedbackForm = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      telnum: [0, Validators.required],
      email: [
        '',
        [
          Validators.email,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ],
      ],
      agree: false,
      contacttype: 'None',
      message: '',
    });
  }

  onSubmit() {
    this.feedback = this.feedbackForm.value;
    console.log(this.feedback);
    this.feedbackForm.reset({
      firstname: '',
      lastname: '',
      telnum: 0,
      email: '',
      agree: false,
      contactType: 'None',
      message: '',
    });
    this.feedbackFormDirective.resetForm();
  }
}
