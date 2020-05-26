import { Component, OnInit, Input, ViewChild, Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { Comment } from '../shared/comment';

import { DishService } from '../services/dish.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  animations: [
    trigger('visibility', [
      state(
        'shown',
        style({
          transform: 'scale(1.0)',
          opacity: 1,
        })
      ),
      state(
        'hidden',
        style({
          transform: 'scale(0.5)',
          opacity: 0,
        })
      ),
      transition('* => *', animate('0.5s ease-in-out')),
    ]),
  ],
})
export class DishdetailComponent implements OnInit {
  dish: Dish;
  dishCopy: Dish;
  dishIds: string[];
  prev: string;
  next: string;
  errMess: string;

  @ViewChild('cform') commentFormDirective;
  commentForm: FormGroup;

  previewComment: Comment;
  comment: Comment;

  visibility = 'shown';

  formErrors = {
    name: '',
    comment: '',
  };

  validationMessages = {
    name: {
      required: 'Author name is required',
      minlength: 'Author name must be at least 2 characters long.',
    },
    comment: {
      required: 'Comment is required',
    },
  };

  constructor(
    private dishService: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private formBuilder: FormBuilder,
    @Inject('BaseURL') public BaseURL
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.dishService.getDishIds().subscribe((ids) => (this.dishIds = ids));
    this.route.params
      .pipe(
        switchMap((params: Params) => {
          this.visibility = 'hidden';
          return this.dishService.getDish(params['id']);
        })
      )
      .subscribe(
        (dish) => {
          this.dish = dish;
          this.dishCopy = dish;
          this.setPrevNext(dish.id);
          this.visibility = 'shown';
        },
        (errMess) => (this.errMess = <any>errMess)
      );
  }

  createForm() {
    this.commentForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      comment: ['', [Validators.required]],
      rating: 5,
    });

    this.commentForm.valueChanges.subscribe((data) => {
      this.onValueChanged(data);
    });
    this.onValueChanged();
  }

  onValueChanged(data?: any) {
    if (!this.commentForm) {
      return;
    }

    const form = this.commentForm;

    if (data) {
      this.previewComment = new Comment();
      this.previewComment.author = data.name;
      this.previewComment.comment = data.comment;
      this.previewComment.rating = data.rating;
    }

    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  goBack(): void {
    this.location.back();
  }

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);

    this.prev = this.dishIds[
      (this.dishIds.length + index - 1) % this.dishIds.length
    ];
    this.next = this.dishIds[
      (this.dishIds.length + index + 1) % this.dishIds.length
    ];
  }

  onSubmit(): void {
    this.comment = this.previewComment;
    this.comment.date = new Date().toISOString();
    this.dishCopy.comments.push(this.comment);
    this.dishService.putDish(this.dishCopy).subscribe(
      (dish) => {
        this.dish = dish;
        this.dishCopy = dish;
      },
      (errMess) => {
        this.dish = null;
        this.dishCopy = null;
        this.errMess = <any>errMess;
      }
    );
    this.commentFormDirective.resetForm();
    this.commentForm.reset({
      name: '',
      comment: '',
      rating: 5,
    });
  }
}
