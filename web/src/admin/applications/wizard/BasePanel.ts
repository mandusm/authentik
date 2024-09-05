import { WizardStep } from "@goauthentik/components/ak-wizard-main/AkWizardStep";
import { WizardUpdateEvent } from "@goauthentik/components/ak-wizard-main/events";
import { AKElement } from "@goauthentik/elements/Base";
import { KeyUnknown, serializeForm } from "@goauthentik/elements/forms/Form";
import { HorizontalFormElement } from "@goauthentik/elements/forms/HorizontalFormElement";
import { CustomEmitterElement } from "@goauthentik/elements/utils/eventEmitter";

import { consume } from "@lit/context";
import { query } from "@lit/reactive-element/decorators.js";

import { styles as AwadStyles } from "./BasePanel.css";

import { applicationWizardContext } from "./ContextIdentity";
import type { ApplicationWizardState, ApplicationWizardStateUpdate } from "./types";

/**
 * Application Wizard Base Panel
 *
 * All of the displays in our system inherit from this object, which supplies the basic CSS for all
 * the inputs we display, as well as the values and validity state for the form currently being
 * displayed.
 *
 */

export class ApplicationWizardPageBase extends CustomEmitterElement(AKElement) {
    static get styles() {
        return AwadStyles;
    }

    @consume({ context: applicationWizardContext })
    public wizard!: ApplicationWizardState;

    @query("form")
    form!: HTMLFormElement;

    step: WizardStep;

    constructor(step: WizardStep) {
        super();
        this.step = step;
    }

    /**
     * Provide access to the values on the current form. Child implementations use this to craft the
     * update that will be sent using `dispatchWizardUpdate` below.
     */
    get formValues(): KeyUnknown | undefined {
        const elements = [
            ...Array.from(
                this.form.querySelectorAll<HorizontalFormElement>("ak-form-element-horizontal"),
            ),
            ...Array.from(this.form.querySelectorAll<HTMLElement>("[data-ak-control=true]")),
        ];
        return serializeForm(elements as unknown as NodeListOf<HorizontalFormElement>);
    }

    /**
     * Provide access to the validity of the current form. Child implementations use this to craft
     * the update that will be sent using `dispatchWizardUpdate` below.
     */
    get valid() {
        return this.form.checkValidity();
    }

    /**
     * Provide a single source of truth for the token used to notify the orchestrator that an event
     * happens. The token `ak-wizard-update` is used by the Wizard framework's reactive controller
     * to route "data on the current step has changed" events to the orchestrator.
     */
    dispatchWizardUpdate(update: ApplicationWizardStateUpdate) {
        this.dispatchEvent(new WizardUpdateEvent(update));
    }
}

export default ApplicationWizardPageBase;
