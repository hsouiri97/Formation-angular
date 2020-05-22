import { Component, OnInit, Input } from '@angular/core';
import { Dish } from '../shared/dish';

import { DishService } from '../services/dish.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
})
export class DishdetailComponent implements OnInit {
  //@Input()
  dish: Dish;
  dishIds: string[];
  prev: string;
  next: string;

  constructor(
    private dishService: DishService,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    /*const id = this.route.snapshot.params['id'];
    this.dishService.getDish(id).subscribe((dish) => (this.dish = dish));
    this.setPrevNext(id);*/
    //the code above will not work
    this.dishService.getDishIds().subscribe((ids) => (this.dishIds = ids));
    this.route.params
      .pipe(
        switchMap((params: Params) => this.dishService.getDish(params['id']))
      )
      .subscribe((dish) => {
        this.dish = dish;
        this.setPrevNext(dish.id);
      });
  }

  goBack(): void {
    this.location.back();
  }

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    console.log('index: ', index);

    this.prev = this.dishIds[
      (this.dishIds.length + index - 1) % this.dishIds.length
    ];
    console.log('prev: ', this.prev);
    this.next = this.dishIds[
      (this.dishIds.length + index + 1) % this.dishIds.length
    ];
    console.log('next: ', this.next);
  }
}
