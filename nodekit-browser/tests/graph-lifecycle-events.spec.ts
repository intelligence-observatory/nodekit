import {expect, test} from '@playwright/test';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';

const nodeKitScriptPath = fileURLToPath(new URL('../dist/nodekit.js', import.meta.url));
const nodeKitCssPath = fileURLToPath(new URL('../dist/nodekit.css', import.meta.url));
const packageJsonPath = fileURLToPath(new URL('../package.json', import.meta.url));
const {version} = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as {version: string};

const graph = {
    type: 'Graph',
    nodekit_version: version,
    nodes: {
        trial: {
            type: 'Graph',
            nodekit_version: version,
            nodes: {
                inner: {
                    type: 'Node',
                    card: null,
                    sensor: {
                        sensor_type: 'WaitSensor',
                        duration_msec: 1,
                    },
                    board_color: '#ffffffff',
                    hide_pointer: false,
                    annotation: null,
                },
            },
            transitions: {
                inner: {
                    transition_type: 'End',
                    register_updates: {},
                },
            },
            start: 'inner',
            registers: {},
            annotation: 'child graph',
        },
    },
    transitions: {
        trial: {
            transition_type: 'End',
            register_updates: {},
        },
    },
    start: 'trial',
    registers: {},
    annotation: 'root graph',
};

test('emits root and nested Graph lifecycle events', async ({page, isMobile}) => {
    test.skip(isMobile, 'NodeKit only supports desktop browsers.');

    await page.setViewportSize({width: 1100, height: 1100});
    await page.setContent('<!doctype html><html><body></body></html>');
    await page.addStyleTag({path: nodeKitCssPath});
    await page.addScriptTag({path: nodeKitScriptPath});

    await page.evaluate((playGraph) => {
        (window as Window & {__events?: unknown[]}).__events = [];
        void (window as Window & {
            NodeKit: {
                play: (
                    graph: unknown,
                    onEventCallback: (event: unknown) => void,
                    debugMode: boolean,
                ) => Promise<void>;
            };
        }).NodeKit.play(
            playGraph,
            (event) => {
                (window as Window & {__events: unknown[]}).__events.push(event);
            },
            true,
        );
    }, graph);

    await page.waitForFunction(() => {
        const events = (window as Window & {
            __events: {event_type?: string; graph_address?: string[]}[];
        }).__events;
        return events.some(
            (event) => event.event_type === 'GraphEndedEvent' && event.graph_address?.length === 0,
        );
    });

    const graphEvents = await page.evaluate(() => {
        const events = (window as Window & {
            __events: {event_type: string; graph_address?: string[]}[];
        }).__events;
        return events
            .filter((event) => event.event_type === 'GraphStartedEvent' || event.event_type === 'GraphEndedEvent')
            .map((event) => ({
                event_type: event.event_type,
                graph_address: event.graph_address,
            }));
    });

    expect(graphEvents).toEqual([
        {event_type: 'GraphStartedEvent', graph_address: []},
        {event_type: 'GraphStartedEvent', graph_address: ['trial']},
        {event_type: 'GraphEndedEvent', graph_address: ['trial']},
        {event_type: 'GraphEndedEvent', graph_address: []},
    ]);
});
