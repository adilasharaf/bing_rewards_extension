export interface AppInterface {
  storage?: {
    local: any;
    get: (id: string) => Promise<any>;
    read: (id: string) => any;
    update: (callback: any) => void;
    write: (id: string, data: any) => Promise<void>;
    load: (callback: any) => void;
  };

  netrequest?: {
    display: {
      badge: {
        text: (e: any) => Promise<unknown>;
      };
    };
    engine: {
      rulesets: {
        update: (options: any) => Promise<unknown>;
      };
      rules: {
        get: () => Promise<any[]>;
        update: (options: any) => Promise<unknown>;
      };
    };
    rules: {
      stack?: any[];
      scope: any;
      update: () => Promise<void>;
      push: (e: any) => void;
      find: {
        next: {
          available: {
            id: () => number;
          };
        };
      };
      remove: {
        by: {
          ids: (removeRuleIds: number[]) => Promise<void>;
          scope: any;
          condition: any;
          action: any;
        };
      };
    };
  };
}
