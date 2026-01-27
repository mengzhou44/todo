import { gql } from '@apollo/client';

export const GET_PROCEDINGS = gql`
  query Proceedings($filter: ProceedingsFilterInput) {
    proceedings(filter: $filter) {
      data {
        id
        proceedingId
        location
        status
        description
        reportUpdate
        partiesNames
        hearingDates {
          startDate
          endDate
        }
      }
    }
  }
`;

export interface ProceedingsFilterInput {
  proceedingId?: string;
  partyName?: string;
  dateFrom?: string;
  dateTo?: string;
  proceedingStatus?: string;
  proceedingType?: string;
  jointHearing?: boolean;
}

export interface HearingDate {
  startDate?: string;
  endDate?: string;
}

export interface ProceedingData {
  id: string;
  proceedingId: string;
  location?: string;
  status: string;
  description: string;
  reportUpdate?: string;
  partiesNames?: string[];
  hearingDates?: HearingDate;
}

export interface ProceedingsResponse {
  proceedings: {
    data: ProceedingData[];
  };
}


