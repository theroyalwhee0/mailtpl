"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeMailingTemplate = void 0;
function serializeMailingTemplate(template) {
    const name = template.name();
    const ident = template.ident();
    const subject = template.subject();
    const source = template.source();
    const fromEmail = template.fromEmail();
    const fromName = template.fromName();
    const html = template.html();
    return {
        source,
        name,
        ident,
        fromEmail,
        fromName,
        subject,
        html,
    };
}
exports.serializeMailingTemplate = serializeMailingTemplate;
//# sourceMappingURL=writer.js.map