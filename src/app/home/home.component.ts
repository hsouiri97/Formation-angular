import { Component, OnInit, Inject } from '@angular/core';

import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Promotion } from '../shared/promotion';
import { PromotionService } from '../services/promotion.service';
import { LeaderService } from '../services/leader.service';
import { Leader } from '../shared/leader';
import { flyInOut, expand } from '../animations/app.animation';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    style: 'display: block;',
  },
  animations: [flyInOut(), expand()],
})
export class HomeComponent implements OnInit {
  dish: Dish;
  promotion: Promotion;
  leader: Leader;

  constructor(
    private dishService: DishService,
    private promotionService: PromotionService,
    private leaderService: LeaderService,
    @Inject('BaseURL') public BaseURL
  ) {}

  dishErrMess: string;
  promoErrMess: string;
  leaderErrMess: string;

  ngOnInit(): void {
    this.dishService.getFeaturedDish().subscribe(
      (dish) => (this.dish = dish),
      (dishErrMess) => (this.dishErrMess = <any>dishErrMess)
    );
    this.promotionService.getFeaturedPromotion().subscribe(
      (promotion) => (this.promotion = promotion),
      (promoErrMess) => (this.promoErrMess = <any>promoErrMess)
    );
    this.leaderService.getFeaturedLeader().subscribe(
      (leader) => (this.leader = leader),
      (leaderErrMess) => (this.leaderErrMess = <any>leaderErrMess)
    );
  }
}
