"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var sarlacc_angular_client_1 = require("sarlacc-angular-client");
var LoginComponent = (function () {
    function LoginComponent(userService, broadcaster, router) {
        this.userService = userService;
        this.broadcaster = broadcaster;
        this.router = router;
        this.loginLoading = false;
        this.creds = {};
        this.errorMessage = '';
    }
    LoginComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.errorMessage = '';
        this.userService.returnUser()
            .then(function (user) {
            _this.user = user;
        }).catch(function (error) {
        });
    };
    LoginComponent.prototype.login = function () {
        var _this = this;
        event.preventDefault();
        this.loginLoading = true;
        this.errorMessage = '';
        this.userService.login(this.creds)
            .then(function (user) {
            _this.user = user;
            _this.loginLoading = false;
            _this.creds = {};
            var link = ['/'];
            _this.router.navigate(link);
        }).catch(function (error) {
            console.log(error);
            _this.loginLoading = false;
            _this.errorMessage = error;
        });
    };
    LoginComponent.prototype.logout = function () {
        event.preventDefault();
        if (confirm('Are you sure you want to logout?')) {
            this.userService.logout();
            this.user = null;
        }
    };
    return LoginComponent;
}());
LoginComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'login',
        templateUrl: 'login.component.html',
        styleUrls: ['login.component.css']
    }),
    __metadata("design:paramtypes", [sarlacc_angular_client_1.UserService,
        sarlacc_angular_client_1.Broadcaster,
        router_1.Router])
], LoginComponent);
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=login.component.js.map