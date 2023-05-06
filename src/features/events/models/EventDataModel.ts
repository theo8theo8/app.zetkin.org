import Environment from 'core/env/Environment';
import { ModelBase } from 'core/models';
import theme from 'theme';
import EventsRepo, {
  ZetkinEventPatchBody,
  ZetkinEventPostBody,
} from '../repo/EventsRepo';
import { IFuture, PromiseFuture } from 'core/caching/futures';
import {
  ZetkinEvent,
  ZetkinEventParticipant,
  ZetkinEventResponse,
  ZetkinLocation,
} from 'utils/types/zetkin';

export enum EventState {
  CANCELLED = 'cancelled',
  DRAFT = 'draft',
  ENDED = 'ended',
  OPEN = 'open',
  SCHEDULED = 'scheduled',
  UNKNOWN = 'unknown',
}

export default class EventDataModel extends ModelBase {
  private _env: Environment;
  private _eventId: number;
  private _orgId: number;
  private _repo: EventsRepo;

  addParticipant(personId: number) {
    this._repo.addParticipant(this._orgId, this._eventId, personId);
  }

  cancelParticipant(personId: number): IFuture<ZetkinEventParticipant> {
    const promise = this._repo.updateParticipant(
      this._orgId,
      this._eventId,
      personId,
      {
        status: 'cancelled',
      }
    );

    const contactId = this.getData().data?.contact?.id;
    if (contactId == personId) {
      this._repo.updateEvent(this._orgId, this._eventId, {
        contact_id: null,
      });
    }

    return new PromiseFuture(promise);
  }

  constructor(env: Environment, orgId: number, eventId: number) {
    super();
    this._env = env;
    this._orgId = orgId;
    this._eventId = eventId;
    this._repo = new EventsRepo(env);
  }

  createEvent(eventBody: ZetkinEventPostBody): IFuture<ZetkinEvent> {
    const promise = this._repo
      .createEvent(eventBody, this._orgId)
      .then((event: ZetkinEvent) => {
        this._env.router.push(
          `/organize/${this._orgId}/projects/${event.campaign!.id}/events/${
            event.id
          }`
        );
        return event;
      });
    return new PromiseFuture(promise);
  }

  deleteEvent() {
    this._repo.deleteEvent(this._orgId, this._eventId);
  }

  getBookedParticipants() {
    const participants = this.getParticipants().data;
    return participants?.filter((p) => p.cancelled == null) ?? [];
  }

  getCancelledParticipants() {
    const participants = this.getParticipants().data;
    return participants?.filter((p) => p.cancelled != null) ?? [];
  }

  getData(): IFuture<ZetkinEvent> {
    return this._repo.getEvent(this._orgId, this._eventId);
  }

  getNumAvailParticipants(): number {
    const participants = this.getParticipants().data;
    return participants
      ? participants.filter((p) => p.cancelled == null).length
      : 0;
  }

  getNumCancelledParticipants(): number {
    const participants = this.getParticipants().data;
    return participants?.filter((p) => p.cancelled != null).length ?? 0;
  }

  getNumRemindedParticipants(): number {
    const participants = this.getParticipants().data;
    return (
      participants?.filter(
        (p) => p.reminder_sent != null && p.cancelled == null
      ).length ?? 0
    );
  }

  getNumSignedParticipants(): number {
    const participants = this.getParticipants().data;
    const respondents = this.getRespondents().data;
    return (
      respondents?.filter((r) => !participants?.some((p) => p.id === r.id))
        .length ?? 0
    );
  }

  getParticipantStatus = () => {
    const availParticipants = this.getNumAvailParticipants();
    const reqParticipants = this.getData().data?.num_participants_required ?? 0;
    const diff = reqParticipants - availParticipants;

    if (diff <= 0) {
      return theme.palette.statusColors.green;
    } else if (diff === 1) {
      return theme.palette.statusColors.orange;
    } else {
      return theme.palette.statusColors.red;
    }
  };

  getParticipants(): IFuture<ZetkinEventParticipant[]> {
    return this._repo.getEventParticipants(this._orgId, this._eventId);
  }

  getPendingSignUps(): ZetkinEventResponse[] {
    const participants = this.getParticipants().data;
    const respondents = this.getRespondents().data;

    return (
      respondents?.filter((r) => !participants?.some((p) => p.id === r.id)) ||
      []
    );
  }

  getRespondents(): IFuture<ZetkinEventResponse[]> {
    return this._repo.getEventRespondents(this._orgId, this._eventId);
  }

  reBookParticipant(personId: number) {
    this._repo.updateParticipant(this._orgId, this._eventId, personId, {
      status: null,
    });
  }

  removeContact() {
    this._repo.updateEvent(this._orgId, this._eventId, {
      contact_id: null,
    });
  }

  sendReminders() {
    this._repo.sendReminders(this._orgId, this._eventId);
  }

  async setContact(contactId: number) {
    const eventParticipantsList = this.getParticipants().data;
    if (!eventParticipantsList?.find((item) => item.id == contactId)) {
      await this._repo.addParticipant(this._orgId, this._eventId, contactId);
    }
    this._repo.updateEvent(this._orgId, this._eventId, {
      contact_id: contactId,
    });
  }

  setLocation(location: ZetkinLocation) {
    this._repo.updateEvent(this._orgId, this._eventId, {
      location_id: location.id,
    });
  }

  setPublished(published: string | null) {
    this._repo.updateEvent(this._orgId, this._eventId, {
      cancelled: null,
      published: published ? new Date(published).toISOString() : null,
    });
  }

  setReqParticipants(reqParticipants: number) {
    this._repo.updateEvent(this._orgId, this._eventId, {
      num_participants_required: reqParticipants,
    });
  }

  setTitle(title: string) {
    this._repo.updateEvent(this._orgId, this._eventId, { title });
  }

  setType(id: number) {
    this._repo.updateEvent(this._orgId, this._eventId, {
      activity_id: id,
    });
  }

  get state(): EventState {
    const { data } = this.getData();
    if (!data) {
      return EventState.UNKNOWN;
    }

    if (data.start_time) {
      const startTime = new Date(data.start_time);
      const now = new Date();

      if (startTime > now) {
        return EventState.SCHEDULED;
      } else {
        if (data.end_time) {
          const endTime = new Date(data.end_time);

          if (endTime < now) {
            return EventState.ENDED;
          }
        }

        return EventState.OPEN;
      }
    } else {
      return EventState.DRAFT;
    }
  }

  updateEventData(eventData: ZetkinEventPatchBody) {
    this._repo.updateEvent(this._orgId, this._eventId, eventData);
  }
}
