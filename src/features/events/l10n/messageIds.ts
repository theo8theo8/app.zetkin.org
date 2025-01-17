import { m, makeMessages } from 'core/i18n';

export default makeMessages('feat.events', {
  addPerson: {
    addButton: m('Add person'),
    addPlaceholder: m('Start typing to add participant'),
    status: {
      booked: m('Already booked'),
      signedUp: m('Signed up'),
    },
  },
  common: {
    noLocation: m('No physical location'),
  },
  eventActionButtons: {
    delete: m('Delete'),
    publish: m('Publish'),
    unpublish: m('Unpublish'),
    warning: m<{ eventTitle: string }>('"{eventTitle}" will be deleted.'),
  },
  eventContactCard: {
    header: m('Contact'),
    noContact: m('No Contact Assigned!'),
    removeButton: m('Remove'),
    selectPlaceholder: m('Select a contact person'),
    warningText: m<{ name: string }>(
      '{name} will no longer be the contact person, but will remain booked on the event as a participant'
    ),
  },
  eventOverviewCard: {
    buttonEndDate: m('+ End date'),
    createLocation: m('Create new location'),
    description: m('Description'),
    editButton: m('Edit event information'),
    endDate: m('End'),
    endTime: m('End time'),
    location: m('Location'),
    noLocation: m('No physical location'),
    startDate: m('Start'),
    startTime: m('Start time'),
    url: m('Link'),
  },
  eventParticipantsCard: {
    booked: m('Notifications'),
    contact: m('Contact'),
    header: m('Participants'),
    noContact: m('None assigned'),
    participantList: m('View participants'),
    pending: m('Pending sign-ups'),
    reqParticipantsHelperText: m('The minimum number of participants required'),
    reqParticipantsLabel: m('Required participants'),
  },
  eventParticipantsList: {
    bookedParticipants: m('Booked Participants'),
    buttonBook: m('Book'),
    buttonCancel: m('Cancel'),
    cancelledParticipants: m('Cancelled Participants'),
    columnEmail: m('Email'),
    columnName: m('Name'),
    columnNotified: m('Notified'),
    columnPhone: m('Phone'),
    contactTooltip: m('Contact Person'),
    descriptionBooked: m(
      'These are the people you have booked and are counting on for the event. To cancel their participation they have to contact you and you can cancel them manually.'
    ),
    descriptionCancelled: m(
      "These people have cancelled their participation for some reason. We keep them here so you don't try to book them again."
    ),
    descriptionSignups: m(
      'These people have signed up in the activists portal. They can still cancel their sign-up at any time.'
    ),
    participantTooltip: m('Make contact person'),
    signUps: m('Sign-ups'),
  },
  eventRelatedCard: {
    header: m('Related events'),
  },
  form: {
    activity: m('Activity'),
    campaign: m('Campaign'),
    cancel: m('Cancel'),
    create: m('Create new event'),
    edit: m('Edit event'),
    end: m('End Time'),
    info: m('Information on signup'),
    link: m('Link'),
    minNo: m('Mininum participants'),
    place: m('Place'),
    required: m('Required'),
    start: m('Start Time'),
    submit: m('Submit'),
    title: m('Title'),
  },
  list: {
    events: m('Events'),
    noEvents: m('No events...'),
  },
  locationModal: {
    cancel: m('Cancel'),
    createLocation: m('Create new location'),
    description: m('Description'),
    infoText: m(
      'You can click and drag to pan the map and pinch or scroll to zoom. To create a new location you can click on an empty spot on the map.'
    ),
    move: m('Move'),
    moveInstructions: m('Drag the pin to select location.'),
    noDescription: m('No description'),
    noRelatedEvents: m(
      'There are no other events happening here around this time.'
    ),
    relatedEvents: m('Other events here around this time'),
    save: m('Save'),
    saveLocation: m('Save location'),
    searchBox: m('Find location'),
    title: m('Location name'),
    useLocation: m('Use location'),
  },
  participantSummaryCard: {
    bookButton: m('Book all'),
    booked: m('Notifications'),
    cancelled: m('Cancelled'),
    header: m('Participants'),
    pending: m('Pending sign-ups'),
    remindButton: m('Remind all'),
    reqParticipantsHelperText: m('The minimum number of participants required'),
    reqParticipantsLabel: m('Required participants'),
  },
  search: m('Search'),
  state: {
    cancelled: m('Cancelled'),
    draft: m('Draft'),
    ended: m('Ended'),
    open: m('Open'),
    scheduled: m('Scheduled'),
  },
  stats: {
    participants: m<{ participants: number }>(
      '{participants, plural, one {1 participant} other {# participants}}'
    ),
  },
  tabs: {
    overview: m('Overview'),
    participants: m('Participants'),
  },
  tooltipContent: m('Untitled events will display type as title'),
  type: {
    createType: m<{ type: string }>('Create "{type}"'),
    tooltip: m('Click to change type'),
    uncategorized: m('Uncategorized'),
    untitled: m('Untitled Event'),
  },
});
