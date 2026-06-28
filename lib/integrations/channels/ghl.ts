import { postToGHL } from '@/lib/formActions/postToGHL';
import { ChannelResult, LeadPayload, ChannelConfig } from './types';

/**
 * GoHighLevel channel — wraps the existing postToGHL logic (unchanged) and
 * maps its {success, error} into the uniform ChannelResult.
 */
export async function pushToGHL(payload: LeadPayload, cfg: ChannelConfig): Promise<ChannelResult> {
  const channel = 'ghl';
  const { ghlApiKey, ghlPipelineId, ghlStageId } = cfg.formSettings;
  if (!ghlApiKey) return { channel, ok: false, error: 'no GHL API key configured' };

  const result = await postToGHL(ghlApiKey, {
    fields: payload.fields,
    pipelineId: ghlPipelineId,
    stageId: ghlStageId,
    companyName: payload.companyName,
  });

  return result.success
    ? { channel, ok: true }
    : { channel, ok: false, error: result.error || 'GHL push failed' };
}
