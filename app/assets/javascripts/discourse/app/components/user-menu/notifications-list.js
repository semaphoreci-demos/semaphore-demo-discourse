import UserMenuItemsList from "discourse/components/user-menu/items-list";
import I18n from "I18n";
import { action } from "@ember/object";

export default class UserMenuNotificationsList extends UserMenuItemsList {
  get filterByTypes() {
    return null;
  }

  get showAll() {
    return true;
  }

  get showAllHref() {
    return `${this.currentUser.path}/notifications`;
  }

  get showAllTitle() {
    return I18n.t("user_menu.view_all_notifications");
  }

  get showDismiss() {
    return this.items.some((item) => !item.read);
  }

  get dismissTitle() {
    return I18n.t("user.dismiss_notifications_tooltip");
  }

  get itemsCacheKey() {
    let key = "recent-notifications";
    const types = this.filterByTypes?.toString();
    if (types) {
      key += `-type-${types}`;
    }
    return key;
  }

  get emptyStateComponent() {
    if (this.constructor === UserMenuNotificationsList) {
      return "user-menu/notifications-list-empty-state";
    } else {
      return super.emptyStateComponent;
    }
  }

  fetchItems() {
    const params = {
      limit: 30,
      recent: true,
      bump_last_seen_reviewable: true,
      silent: this.currentUser.enforcedSecondFactor,
    };

    const types = this.filterByTypes?.toString();
    if (types) {
      params.filter_by_types = types;
    }
    return this.store
      .findStale("notification", params)
      .refresh()
      .then((c) => c.content);
  }

  dismissWarningModal() {
    // TODO: add warning modal when there are unread high pri notifications
    return null;
  }

  @action
  dismissButtonClick() {
    // TODO
  }
}